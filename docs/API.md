# API

## `POST /api/contact`

Accepts JSON with `name`, `email`, `message`, and an optional hidden `website` honeypot field. The route validates all fields with Zod, limits each client key to five requests per hour, and sends valid messages through Resend. The Resend API key is read only from `RESEND_API_KEY`; `RESEND_FROM_EMAIL` and `CONTACT_EMAIL` configure the sender and recipient. The visitor email is passed as `Reply-To`.

Responses are `200` for delivery, `400` for invalid input, `429` for rate limiting, `502` for provider failures, and `503` when email configuration is missing.
