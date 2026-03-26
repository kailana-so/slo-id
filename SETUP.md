# Setup Guide

## 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL editor, run the contents of `supabase/migrations/001_initial_schema.sql`
3. Under **Authentication → Providers**, enable Email
4. Collect the following from **Project Settings → API Keys**:
   - `SUPABASE_URL` — your project URL
   - `VITE_SUPABASE_ANON_KEY` — the **Publishable key**
   - `SUPABASE_SERVICE_ROLE_KEY` — the **Secret key**

---

## 2. AWS S3

1. Create an S3 bucket (e.g. `slo-id-media`) in your preferred region
2. Under the bucket's **Permissions → CORS**, add:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT"],
       "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
       "ExposeHeaders": []
     }
   ]
   ```
3. Create an IAM user with `AmazonS3FullAccess` (or a scoped policy for the bucket)
4. Generate access keys and collect:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_BUCKET` (your bucket name)
   - `AWS_REGION` (e.g. `ap-southeast-2`)

---

## 3. OpenWeatherMap

1. Create a free account at [openweathermap.org](https://openweathermap.org)
2. Generate an API key and collect:
   - `WEATHER_API_KEY`

---

## 4. Environment variables

### Server — `server/.env`

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=

NOMINATIM_API_HOST=https://nominatim.openstreetmap.org/reverse
WEATHER_API_HOST=https://api.openweathermap.org/data/2.5/weather
WEATHER_API_KEY=
EMAIL_SIGNER=your@email.com

CLIENT_URL=http://localhost:5173
```

### Client — `client/.env`

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:8000
```

---

## 5. Run locally

### Server

```bash
cd server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`

### Client

```bash
cd client
yarn install
yarn dev
```

Client at `http://localhost:5173`

---

## 6. Deploy

### Server → Railway

1. Create a new project at [railway.app](https://railway.app)
2. Connect your GitHub repo, set the root directory to `server`
3. Add all server env vars under **Variables**
4. Railway will auto-detect Python and run `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Client → Cloudflare Pages

1. Create a new project at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo, set the root directory to `client`
3. Build command: `yarn build`
4. Output directory: `dist`
5. Add env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` — set to your Railway server URL

---

## 7. Smoke test checklist

- [ ] Sign up and log in
- [ ] Create a sighting with a photo — confirm thumbnail appears
- [ ] Create a sighting with a video or audio file
- [ ] Location and environmental data toggle works
- [ ] Sighting appears on the map
- [ ] Species form fields save correctly
