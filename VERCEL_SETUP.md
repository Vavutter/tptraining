# Vercel Setup (Phase 4.1)

## 1) Required Vercel Environment Variables

Set these in **Project Settings > Environment Variables**:

- `BOOKING_BUSINESS_EMAIL` (optional, default: `tp.training@gmx.net`)

Choose at least one server delivery target:

- `BOOKING_WEBHOOK_URL`

or

- `RESEND_API_KEY`
- `BOOKING_TO_EMAIL`
- `BOOKING_FROM_EMAIL` (optional, default: `TPTraining <onboarding@resend.dev>`)

## 2) Deploy

```bash
npx vercel login
npx vercel link
npx vercel deploy --prod -y
```

## 3) Verify

- Hero and card images load.
- Booking flow submits without client-side errors.
- If server delivery is configured, success text should indicate the request was received.
