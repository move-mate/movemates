# MoveMates Web App

Next.js app for the MoveMates marketing site, chatbot endpoint, and waitlist API.

## Requirements

- Node.js 18+
- npm

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the project root.

```env
MISTRAL_API_KEY=mistral_token
EMBEDDINGS_PATH_FILE=points_to_embedings
RAG_FILE_PATH=points_to_rag_document
GOOGLE_SERVICE_ACCOUNT_JSON='{"client_email":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"}'
GOOGLE_SHEETS_SPREADSHEET_ID=your_google_sheet_id
GOOGLE_SHEETS_SHEET_NAME=Waitlist
CORS_ALLOWED_ORIGINS=https://movemates.co.za,https://www.movemates.co.za
```

Optional:

```env
# Only use if you intentionally need an absolute API base URL.
NEXT_PUBLIC_API_BASE_URL=https://movemates.co.za
```

## Domain and CORS Setup

This app supports both:

- `https://movemates.co.za`
- `https://www.movemates.co.za`

CORS behavior:

- API routes explicitly allow configured origins.
- Default allowed origins include the two production domains and localhost.
- Additional origins can be added via `CORS_ALLOWED_ORIGINS` (comma-separated).
- `OPTIONS` preflight is handled for API routes.

Security note:

- Allowed CORS origins are not secrets.
- CORS is a browser policy, not authentication.
- Keep server-side validation and anti-abuse controls (rate limiting/captcha) on public endpoints.

## Build and Run

```bash
npm run build
npm run start
```

## Testing

```bash
npm run test
```

## Contact

For questions or support, contact `movemates3@gamil.com`.
