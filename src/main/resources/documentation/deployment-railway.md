# Deploying SLOGBAA for Client Testing (Railway)

This guide gets the app running on **Railway** so the client can test from their browser. One URL for both UI and API.

---

## What you get

- **One service**: Spring Boot serves the React app and the REST API.
- **PostgreSQL**: Railway add-on (or external free DB).
- **Free tier**: Railway’s free plan includes about **$1/month credit**; the trial gives more. Enough for a demo.

---

## 1. Prerequisites

- GitHub (or GitLab) repo with the SLOGBAA code.
- [Railway](https://railway.app) account (GitHub login).

---

## 2. Create a new project on Railway

1. Go to [railway.app](https://railway.app) → **Start a New Project**.
2. Choose **Deploy from GitHub repo** and connect the SLOGBAA repo.
3. Add **PostgreSQL**: in the project, click **+ New** → **Database** → **PostgreSQL**. Railway will create a DB and expose `DATABASE_URL` (or `PG*` variables).

---

## 3. Add the app service (Dockerfile)

1. In the same project, click **+ New** → **GitHub Repo** (or **Empty Service** if you prefer to link repo after).
2. Select the SLOGBAA repository.
3. Railway will detect the **Dockerfile** at the repo root and build it. If it doesn’t, set **Root Directory** to repo root and **Dockerfile path** to `./Dockerfile`.
4. Under **Settings** for the service, set **Build** to use the Dockerfile (default when Dockerfile is present).

---

## 4. Configure environment variables

In the app service → **Variables**, add (replace with your values where needed):

| Variable | Required | Example / note |
|----------|----------|----------------|
| `PORT` | No | Railway sets this; backend uses `server.port=${PORT:8080}`. |
| `spring.profiles.active` | Yes | `prod` |
| `DATASOURCE_URL` | Yes | `jdbc:postgresql://host:port/railway` (from Railway PostgreSQL “Connect” / Variables). |
| `DATASOURCE_USERNAME` | Yes | From Railway PostgreSQL. |
| `DATASOURCE_PASSWORD` | Yes | From Railway PostgreSQL. |
| `JWT_SECRET` | Yes | Long random string (e.g. 32+ chars). **Do not** use the default from code. |
| `SMTP_HOST` | For emails | e.g. `smtp.example.com` (or leave unset if you don’t need mail yet). |
| `SMTP_PORT` | No | `587` (default in prod). |
| `SMTP_USERNAME` | If using SMTP | |
| `SMTP_PASSWORD` | If using SMTP | |

**Using Railway’s PostgreSQL variables**

Railway often gives a single `DATABASE_URL`. You can either:

- Use **Variable references**: if the DB service exposes `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, set:
  - `DATASOURCE_URL` = `jdbc:postgresql://${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}`
  - `DATASOURCE_USERNAME` = `${{PGUSER}}`
  - `DATASOURCE_PASSWORD` = `${{PGPASSWORD}}`
- Or copy the values from the PostgreSQL service and set `DATASOURCE_*` explicitly.

---

## 5. Deploy and get the URL

1. Trigger a deploy (push to the connected branch or **Deploy** in the dashboard).
2. In the app service → **Settings** → **Networking** → **Generate Domain**. You’ll get a URL like `https://your-app.up.railway.app`.
3. Open that URL: the client should see the SLOGBAA UI (login/register). API is on the same origin (`/api`, `/auth`).

---

## 6. First SuperAdmin (seed data)

If your Flyway seed (e.g. `V7__seed_sample_data.sql` / `V8__update_seed_passwords_bcrypt.sql`) creates a SuperAdmin, that user can log in and create staff. Otherwise, add a SuperAdmin via a migration or run a one-off script and then log in to create staff/trainees for the client.

---

## 7. Optional: Render (alternative free tier)

If you prefer **Render**:

- **Web Service**: connect the repo, use **Docker** as environment; set env vars as above. Render provides a Postgres add-on; use its connection string for `DATASOURCE_*`.
- **PostgreSQL**: add from Render dashboard and attach to the web service.
- Free tier: service may sleep after inactivity; first load can be slow.

---

## 8. Summary

| Step | Action |
|------|--------|
| 1 | Railway project + deploy from GitHub. |
| 2 | Add PostgreSQL; note connection vars. |
| 3 | App service from same repo (Dockerfile). |
| 4 | Set `spring.profiles.active=prod`, `DATASOURCE_*`, `JWT_SECRET`, and optional SMTP. |
| 5 | Generate public domain; share URL with client. |
| 6 | Ensure a SuperAdmin exists (seed or script) for login. |

The client uses **one link**; the backend serves both the React app and the API from that URL.
