# LLM Inference Optimizer

Optimus is a full-stack inference playground for comparing open-weight LLMs and tuning generation parameters.

It includes:

- A Next.js frontend for chat, model comparison, and optimization controls
- A FastAPI backend that proxies requests to Hugging Face Router
- Supabase authentication with JWT validation in the backend

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Supabase JS client

### Backend

- FastAPI
- Uvicorn
- httpx
- PyJWT + cryptography
- pydantic-settings

## Project Structure

```text
src/
	app/
		page.tsx            # Main chat page
		compare/page.tsx    # Model comparison UI
		optimize/page.tsx   # Inference settings UI
	components/
	context/
	lib/
backend/
	main.py               # FastAPI app entrypoint
	routes/               # /chat and /models routes
	services/             # Hugging Face + auth services
	core/config.py        # Env config + allowed model whitelist
```

## Prerequisites

- Node.js 20+
- Python 3.10+
- A Supabase project
- A Hugging Face API key with Router access

## Environment Variables

The app relies on both frontend and backend environment variables.

### Frontend (`.env.local` at repo root)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`.env` at repo root)

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=optional_legacy_secret
```

Notes:

- Backend validation currently uses Supabase JWKS, not `SUPABASE_JWT_SECRET`.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` can also be sourced from `NEXT_PUBLIC_*` aliases.

## Local Development

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

Start backend from the repository root:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Start frontend:

```bash
npm run dev
```

Open:

- Frontend: http://localhost:3000
- Backend docs: http://localhost:8000/docs

## Current Features

- Email/password auth via Supabase
- Chat interface with selectable model
- Curated model categories: Fast, Balanced, Powerful
- Inference controls UI for:
	- Temperature
	- Max tokens
	- Top-p
	- Top-k
	- Streaming toggle (UI only at the moment)
- Backend model whitelist enforcement
- Protected API routes requiring Bearer token

## API Endpoints

All endpoints require `Authorization: Bearer <supabase_access_token>`.

### `POST /chat`

Request body:

```json
{
	"message": "Explain KV cache in one paragraph",
	"model": "meta-llama/Meta-Llama-3-8B-Instruct",
	"settings": {
		"temperature": 0.7,
		"max_tokens": 512,
		"top_p": 0.9,
		"top_k": 50,
		"stream": false
	}
}
```

### `GET /models`

Returns allowed/whitelisted models grouped by category.

## Important Implementation Notes

- Frontend chat requests are currently hardcoded to `http://localhost:8000/chat`.
- Backend supports SSE streaming, but frontend currently sends `stream: false` in chat requests.
- CORS is permissive for development (`allow_origins=["*"]`). Tighten this in production.

## Deployment Notes

- Frontend is configured for Vercel (`vercel.json` present).
- Backend should be deployed separately (for example, containerized FastAPI service).
- Update frontend API base URL strategy before production deployment.

## Troubleshooting

- `401 Missing token`:
	- Make sure you are logged in through Supabase on the frontend.
- `401 Invalid token`:
	- Verify `SUPABASE_URL` points to the same Supabase project used by the frontend.
- `500 HUGGINGFACE_API_KEY is not set`:
	- Set `HUGGINGFACE_API_KEY` in backend env.
- `Model not supported`:
	- Pick one of the whitelisted model IDs from `/models`.
