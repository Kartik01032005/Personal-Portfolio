import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(254, "Email address is too long."),
  message: z.string().trim().min(10, "Please enter at least 10 characters.").max(5000, "Message is too long."),
  website: z.string().max(0).optional(),
});

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestLog = new Map<string, number[]>();

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(key) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, recentRequests);
    return true;
  }

  requestLog.set(key, [...recentRequests, now]);
  return false;
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return Response.json(
      { error: "Too many messages from this address. Please try again later." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = contactSchema.safeParse(payload);
  if (!result.success) {
    return Response.json({ error: result.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  }

  // Quietly accept honeypot submissions without sending them.
  if (result.data.website) {
    return Response.json({ success: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    console.error("Contact email service is not configured.");
    return Response.json({ error: "Message delivery is temporarily unavailable." }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const { name, email, message } = result.data;
  let error;
  try {
    ({ error } = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }));
  } catch (deliveryError) {
    console.error("Resend delivery failed.", deliveryError);
    return Response.json({ error: "Message delivery failed. Please try again." }, { status: 502 });
  }

  if (error) {
    console.error("Resend delivery failed.", error);
    return Response.json({ error: "Message delivery failed. Please try again." }, { status: 502 });
  }

  return Response.json({ success: true });
}
