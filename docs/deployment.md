# Deployment Guide

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- Supabase account
- OpenAI API key (or Anthropic)
- Domain name (for production)

## Backend Deployment

### Option 1: Heroku

1. Install Heroku CLI:
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. Set environment variables:
   ```bash
   heroku config:set SUPABASE_URL=your_url
   heroku config:set SUPABASE_KEY=your_key
   heroku config:set OPENAI_API_KEY=your_key
   ```

5. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 2: Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and initialize:
   ```bash
   railway login
   cd backend
   railway init
   ```

3. Deploy:
   ```bash
   railway up
   ```

### Option 3: Docker

1. Create Dockerfile in backend/:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. Build and run:
   ```bash
   docker build -t campusconnect-backend .
   docker run -p 8000:8000 campusconnect-backend
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod
   ```

### Option 3: Static Export

1. Build static files:
   ```bash
   cd frontend
   npm run build
   npm run export
   ```

2. Deploy the `out/` folder to any static hosting service

## Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Create the notices table:
   ```sql
   CREATE TABLE notices (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     title TEXT NOT NULL,
     summary TEXT,
     category TEXT,
     original_content TEXT NOT NULL,
     timestamp TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE INDEX idx_notices_timestamp ON notices(timestamp DESC);
   CREATE INDEX idx_notices_category ON notices(category);
   ```

3. Get your project URL and API key from Settings > API

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your_key
OPENAI_API_KEY=sk-xxx
PORT=8000
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend.com
```

## SSL/HTTPS

For production, ensure:
- Backend has HTTPS enabled (most platforms do this automatically)
- Frontend has HTTPS enabled
- Update CORS to only allow your frontend domain

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring
- Logging (Papertrail, LogDNA)
- Uptime monitoring (UptimeRobot)

## Scaling

For high traffic:
- Use a CDN for frontend (Cloudflare, Vercel Edge)
- Add Redis for caching
- Use connection pooling for database
- Implement rate limiting
- Consider serverless functions

## Backup

Regular backups:
- Supabase automatic backups (Pro plan)
- Manual database exports
- Version control for code
