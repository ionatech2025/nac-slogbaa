# Deploying SLOGBAA for Client Testing (Render)

This guide gets the app running on **Render** so the client can test from their browser. Spring Boot serves both the React app and the REST API from **one URL**.

---

## What you get

- **One Web Service**: The app runs from the **Dockerfile** at the repo root. The image includes the built React app; Spring Boot serves it and the API.
- **PostgreSQL**: Render’s managed PostgreSQL (free tier available). The app connects with `DATASOURCE_*` environment variables.
- **Free tier**: Free Web Services can **spin down** after ~15 minutes of inactivity; the first request after that may take 30–60 seconds to wake up. Good for demos and light testing.

---

## 1. Prerequisites

- GitHub (or GitLab) repo with the SLOGBAA code.
- [Render](https://render.com) account (GitHub login).

---

## 2. Create a PostgreSQL database

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **PostgreSQL**.
2. Choose a name (e.g. `slogbaa-db`), region, and **Free** plan.
3. Click **Create Database**.
4. Once it’s ready, open the database and go to **Info** (or **Connect**). Note:
   - **Internal Database URL** (use this for the Web Service; it’s only valid from other Render services).
   - Or the individual fields: **Host**, **Port**, **Database**, **User**, **Password**.

You will link this database to the Web Service in the next step so the app can connect.

---

## 3. Create the Web Service (Docker)

1. In the Render dashboard, click **New +** → **Web Service**.
2. Connect your **GitHub** (or GitLab) account if needed, then select the **SLOGBAA repository**.
3. Configure the service:
   - **Name**: e.g. `slogbaa`
   - **Region**: same as the database (or closest to your users).
   - **Branch**: e.g. `main` (or the branch you want to deploy).
   - **Runtime**: **Docker**.
   - Render will detect the **Dockerfile** at the repo root. If it doesn’t, set **Dockerfile Path** to `./Dockerfile` and leave **Root Directory** empty (repo root).
4. **Instance type**: **Free** (or paid if you want no spin-down).

---

## 4. Link PostgreSQL and set environment variables

1. In the Web Service configuration, go to **Environment**.
2. Click **Add Environment Group** or **Add Environment Variable**.
3. **Link the database** (recommended):
   - Click **Add from Render** or **Link Database** and select the PostgreSQL database you created.
   - Render will add a variable like `DATABASE_URL` (e.g. `postgresql://user:pass@host:5432/dbname`). The app expects **JDBC** and separate user/password, so add the variables below and derive them from the linked DB or from the database’s **Info** tab.

4. Add these variables (replace with your values where needed):

| Variable | Required | Example / note |
|----------|----------|----------------|
| `spring.profiles.active` | Yes | `prod` |
| `DATASOURCE_URL` | Yes | `jdbc:postgresql://hostname:5432/database_name` (use the **internal** host from Render DB Info). |
| `DATASOURCE_USERNAME` | Yes | Database user from Render DB Info. |
| `DATASOURCE_PASSWORD` | Yes | Database password from Render DB Info. |
| `JWT_SECRET` | Yes | Long random string (e.g. 32+ characters). **Do not** use the default from code. |
| `PORT` | No | Render sets `PORT` (e.g. 10000); the app uses `server.port=${PORT:8080}`. |
| `SMTP_HOST` | For emails | e.g. `smtp.example.com` (optional; leave unset if you don’t need mail yet). |
| `SMTP_PORT` | No | `587` (default in prod). |
| `SMTP_USERNAME` | If using SMTP | |
| `SMTP_PASSWORD` | If using SMTP | |

**Getting `DATASOURCE_*` from Render PostgreSQL**

- Open your PostgreSQL service → **Info**.
- **Internal** connection (use this for the Web Service):
  - Host: `dpg-xxxxx-a.oregon-postgres.render.com` (or similar).
  - Port: `5432`.
  - Database: e.g. `slogbaa_xxxx`.
  - User and Password: from the same page.
- Set:
  - `DATASOURCE_URL` = `jdbc:postgresql://<Internal Host>:5432/<Database>`
  - `DATASOURCE_USERNAME` = &lt;User&gt;
  - `DATASOURCE_PASSWORD` = &lt;Password&gt;

If Render gives you only `DATABASE_URL` (e.g. `postgresql://user:pass@host:5432/dbname`), you can parse it and set the three `DATASOURCE_*` variables manually, or use a **Pre-Deploy Script** / **Dockerfile** that turns `DATABASE_URL` into `DATASOURCE_*` (not covered here; setting the three vars is simplest).

---

## 5. Deploy and get the URL

1. Click **Create Web Service**. Render will build the image from the Dockerfile and deploy.
2. The first build can take several minutes (Maven + frontend build).
3. When the service is **Live**, open the URL shown at the top (e.g. `https://slogbaa.onrender.com`).
4. You should see the SLOGBAA login/register page. The API is on the same origin (`/api`, `/auth`).

**Free tier:** If the service has spun down, the first open may take 30–60 seconds; then it responds normally until it sleeps again after inactivity.

---

## 6. First SuperAdmin (seed data)

If your Flyway seed (e.g. `V7__seed_sample_data.sql` / `V8__update_seed_passwords_bcrypt.sql`) creates a SuperAdmin, that user can log in and create staff. Otherwise, add a SuperAdmin via a migration or a one-off script, then log in to create staff/trainees for the client.

---

## 7. Summary

| Step | Action |
|------|--------|
| 1 | Create a **PostgreSQL** database on Render (Free). |
| 2 | Create a **Web Service** from the SLOGBAA repo; **Runtime** = **Docker** (Dockerfile at repo root). |
| 3 | Link the database to the Web Service (or copy connection details from DB Info). |
| 4 | Set `spring.profiles.active=prod`, `DATASOURCE_URL`, `DATASOURCE_USERNAME`, `DATASOURCE_PASSWORD`, and `JWT_SECRET` (and optional SMTP). |
| 5 | Deploy; use the service URL as the single link for the client. |
| 6 | Ensure a SuperAdmin exists (seed or script) for login. |

The client uses **one link**; Spring Boot serves both the React app and the API from that URL.
