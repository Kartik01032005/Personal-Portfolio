# Architecture

The Contact section is a client form in `src/app/page.tsx` that posts JSON to the Next.js App Router endpoint `src/app/api/contact/route.ts`. The route performs server-side validation, honeypot handling, and in-memory rate limiting before calling Resend. Resend delivers to `CONTACT_EMAIL` and sets the visitor's address as Reply-To. No email credentials cross the client boundary.
