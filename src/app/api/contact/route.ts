import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Email validation regex (RFC 5322 standard compliant simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    let body: ContactRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // Validate name
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Name must be at least 2 characters long." },
        { status: 400 }
      );
    }
    if (trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: "Name must be under 100 characters." },
        { status: 400 }
      );
    }

    // Validate email
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail.length > 254) {
      return NextResponse.json(
        { success: false, error: "Email address is too long." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Validate message
    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 5) {
      return NextResponse.json(
        { success: false, error: "Message must be at least 5 characters long." },
        { status: 400 }
      );
    }
    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message cannot exceed 5000 characters." },
        { status: 400 }
      );
    }

    // Check API Key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY environment variable.");
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not configured. Please set the RESEND_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const toEmail =
      process.env.CONTACT_EMAIL || "kartiknilekani568@gmail.com";

    // Extract sender email address from FROM_EMAIL (e.g. onboarding@resend.dev)
    const rawFrom = process.env.FROM_EMAIL || "onboarding@resend.dev";
    const match = rawFrom.match(/<([^>]+)>/);
    const fromAddress = match ? match[1] : rawFrom.trim();

    // Sanitize visitor name for the sender display name: "Visitor Name <onboarding@resend.dev>"
    const sanitizedSenderName = trimmedName.replace(/["\r\n<>]/g, " ").trim();
    const fromHeader = `${sanitizedSenderName} <${fromAddress}>`;

    const resend = new Resend(apiKey);

    const emailSubject = `New message from ${trimmedName}`;

    // Clean plain-text body format
    const textContent = `New message from your portfolio

Name: ${trimmedName}
Email: ${trimmedEmail}

Message:
${trimmedMessage}

--------------------------------
Sent from Kartik Nilekani's portfolio.`;

    // Clean, lightweight HTML version
    const safeName = trimmedName
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const safeEmail = trimmedEmail
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const safeMessageHtml = trimmedMessage
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");

    const htmlContent = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111827; max-width: 600px; padding: 12px 0;">
  <p style="font-weight: 600; font-size: 16px; margin: 0 0 16px 0;">New message from your portfolio</p>
  <p style="margin: 4px 0;"><strong>Name:</strong> ${safeName}</p>
  <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a></p>
  <p style="margin: 16px 0 4px 0;"><strong>Message:</strong></p>
  <div style="white-space: pre-wrap; word-break: break-word; margin-bottom: 20px;">${safeMessageHtml}</div>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0 10px 0;" />
  <p style="font-size: 13px; color: #6b7280; margin: 0;">Sent from Kartik Nilekani's portfolio.</p>
</div>`;

    const { data, error } = await resend.emails.send({
      from: fromHeader,
      to: [toEmail],
      replyTo: trimmedEmail,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            error.message ||
            "Failed to send email via Resend. Please check your configuration.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Unhandled error in /api/contact:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: `An unexpected error occurred: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
