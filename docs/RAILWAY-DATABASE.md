# Railway Postgres → SLOGBAA Backend

Use this when the backend runs on Railway and the database is Railway Postgres.

---

## 0. Database in a **different** Railway project than the backend

**Private DNS** (`something.railway.internal`) only routes between services in the **same** project. If Postgres lives in **project A** and `slogbaa-backend` in **project B`, the internal hostname will **not** work from the backend.

You can either:

### Option A — Connect over the **public** host (keep two projects)

1. Open the **database project** → **Postgres** → **Variables** (and/or **Connect** / **Data**).
2. Use the **public** connection values (hostname is usually **not** `*.railway.internal`, e.g. `containers-…railway.app` or `*.rlwy.net` / proxy host — whatever Railway shows as **external** / **TCP** / **Public**).
3. On **slogbaa-backend** (other project), set `DATASOURCE_*` from those values, with `?sslmode=require` on the JDBC URL.  
   Copy `PGUSER` / `PGPASSWORD` manually; variable **references** across projects are not available the same way as within one project.

### Option B — Add Postgres **inside** the backend project (simplest ops)

1. Open the **backend’s** Railway **project** (the one that contains `slogbaa-backend`).
2. On the project canvas, click **\+ New** (or **Create** / **Add service**, depending on UI) → choose **Database** → **PostgreSQL** (or pick **PostgreSQL** from the template list).
3. Wait for provisioning → open the new **Postgres** service → **Variables** → use `PGHOST`, `PGPORT`, etc., as in §3 below (same project → internal host usually works).
4. If you had data in the old DB, **dump** it (`pg_dump`) from the old project and **restore** into the new instance, or treat the new DB as empty and let Flyway run.

---

## 1. What Railway gives you (Postgres service)

In your **Railway project** → **Postgres** service → **Variables** (or **Connect** / **Data** tab), you’ll see something like:

| Railway variable   | Example value |
|--------------------|---------------|
| `DATABASE_URL`     | `postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway` |
| `PGHOST`           | `containers-us-west-xxx.railway.app` |
| `PGPORT`           | `5432` |
| `PGUSER`           | `postgres` |
| `PGPASSWORD`       | `xxxxx` |
| `PGDATABASE`       | `railway` |

Railway may show **only** `DATABASE_URL`, or both `DATABASE_URL` and the `PG*` variables.

---

## 2. Where to put it: **backend service** Variables

1. Open your **slogbaa-backend** service (the one that runs the Spring Boot app).
2. Go to **Variables**.
3. Add or reference the variables below.

If the Postgres service is in the **same project**, use **“Add variable” → “Add a variable reference”** and pick the Postgres service, then add the three variables and point them to the referenced values (see below).  
Otherwise copy the values from the Postgres service and paste them as plain variables.

---

## 3. Map Railway → Spring Boot (DATASOURCE_*)

The backend expects **these three variables** (see `application-prod.properties`):

| Set on **slogbaa-backend** | Value / where it comes from |
|----------------------------|-----------------------------|
| **`DATASOURCE_URL`**       | JDBC URL **without** the password in the string (recommended). Example: `jdbc:postgresql://PGHOST:PGPORT/PGDATABASE?sslmode=require`. Railway Postgres uses TLS — always add `?sslmode=require`. |
| **`DATASOURCE_USERNAME`**  | Same as Railway’s **`PGUSER`** (e.g. `postgres`). |
| **`DATASOURCE_PASSWORD`**  | Same as Railway’s **`PGPASSWORD`**. |

**Important:** Put the password **only** in `DATASOURCE_PASSWORD`, not inside `DATASOURCE_URL`. Railway passwords often contain `@`, `#`, `/`, `+`, etc.; embedding them in a URL breaks parsing unless every special character is [URL-encoded](https://en.wikipedia.org/wiki/Percent-encoding). Using three separate variables avoids that entirely.

### If Railway only shows `DATABASE_URL`

`DATABASE_URL` looks like:

`postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

- **DATASOURCE_URL** = `jdbc:postgresql://HOST:PORT/DATABASE?sslmode=require`  
  (same HOST, PORT, DATABASE; add `jdbc` and `?sslmode=require`).
- **DATASOURCE_USERNAME** = `USER`
- **DATASOURCE_PASSWORD** = `PASSWORD`

Example:

- `DATABASE_URL` = `postgresql://postgres:secret@containers-us-west-123.railway.app:5432/railway`
- Then set on **slogbaa-backend**:
  - `DATASOURCE_URL` = `jdbc:postgresql://containers-us-west-123.railway.app:5432/railway?sslmode=require`
  - `DATASOURCE_USERNAME` = `postgres`
  - `DATASOURCE_PASSWORD` = `secret`

---

## 4. Other variables the backend needs (prod)

On the **slogbaa-backend** service, also set:

| Variable                  | Example / note |
|---------------------------|----------------|
| `SPRING_PROFILES_ACTIVE`  | `prod` |
| `JWT_SECRET`              | Long random string (e.g. 32+ chars). Generate once and keep it. |
| `CORS_ALLOWED_ORIGINS`    | Your frontend URL, e.g. `https://nac-slogbaa.vercel.app` |
| `PASSWORD_RESET_BASE_URL` | Same frontend URL |
| `PORT`                    | Usually leave unset; Railway sets it. |

Optional: `SMTP_*`, `RESEND_*`, etc. if you use email.

---

## 5. Linking Postgres to the backend (same project)

1. **slogbaa-backend** → **Variables** → **Add variable** → **Add a variable reference**.
2. Choose the **Postgres** service.
3. Add:
   - `DATASOURCE_URL` → reference or formula: you may need to build the JDBC URL from `PGHOST`, `PGPORT`, `PGDATABASE` (see above). If Railway supports a formula like `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}?sslmode=require`, use that; otherwise copy the referenced values into a single `DATASOURCE_URL` string.
   - `DATASOURCE_USERNAME` → reference `PGUSER`.
   - `DATASOURCE_PASSWORD` → reference `PGPASSWORD`.

After saving, redeploy the backend so the new variables are used.

---

## 6. “Flyway” in deploy logs + healthcheck failure

These are usually **one problem**, not two:

1. Spring Boot starts **Flyway** migrations against Postgres.
2. If Flyway throws (bad connection, SQL error, checksum conflict, half-applied DB), the app **never finishes starting**.
3. Nothing listens on `PORT`, so Railway’s **healthcheck** fails after several minutes even if you use `/actuator/health/liveness`.

### What to do

1. Open **slogbaa-backend** → **Deployments** → failed deploy → **Deploy Logs** (not Build Logs).
2. Scroll to the **bottom** and search for **`Caused by:`**, **`FlywayException`**, **`SQLException`**, or **`Migration`**. That line is the real error (connection refused, auth failed, duplicate object, etc.).
3. **Fix `DATASOURCE_*`:** use `PGHOST` / `PGPORT` / `PGDATABASE` in `DATASOURCE_URL` and **never** put the password in the URL (see §3). Confirm `?sslmode=require`.
4. **Prod profile:** `SPRING_PROFILES_ACTIVE=prod`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` (HTTPS), `PASSWORD_RESET_BASE_URL` must all be set or startup can fail before or after Flyway.
5. **Half-migrated database:** If a previous deploy failed mid-migration, you may need to restore a **fresh** Railway Postgres volume or connect with `psql` and fix/drop the partial schema, then redeploy. `spring.flyway.repair-on-migrate=true` is already enabled in prod for checksum repair; it does not fix broken partial DDL.

### Quick checklist

| Check | |
|--------|---|
| `DATASOURCE_URL` has **no** password embedded | ✓ |
| URL ends with `?sslmode=require` | ✓ |
| `DATASOURCE_USERNAME` / `DATASOURCE_PASSWORD` match Postgres service | ✓ |
| Backend and Postgres are in the **same Railway project** (or use **public** host if cross-project) | ✓ |
| Read the **last** `Caused by` in deploy logs | ✓ |

### Common mistakes (from real deploy errors)

| Wrong | Right |
|--------|--------|
| `jdb:postgresql://...` (missing **c**) | `jdbc:postgresql://...` |
| `jdbc:postgresql://postgres:SECRET@host:5432/db?...` (user+password in URL) | URL = `jdbc:postgresql://host:5432/db?sslmode=require` only; user/password in `DATASOURCE_USERNAME` / `DATASOURCE_PASSWORD` |
| Space inside password when pasted into URL | Copy `PGPASSWORD` from Postgres variables in one piece, no spaces |

**Internal host example (same Railway project):**  
`DATASOURCE_URL=jdbc:postgresql://postgres.railway.internal:5432/railway?sslmode=require`  
`DATASOURCE_USERNAME=postgres`  
`DATASOURCE_PASSWORD=<exact value from PGUSER’s password variable, no spaces added>`

> The hostname **`postgres.railway.internal`** is only an example. Your real **`PGHOST`** may differ (e.g. `containers-xxx.railway.app`). **Always copy `PGHOST`, `PGPORT`, and `PGDATABASE` from the Postgres service Variables** — do not guess the internal hostname.

---

## 7. SQLState `08001` — “The connection attempt failed”

The URL is usually syntactically OK, but nothing answers on the network (wrong host/port, DNS, or TLS).

1. **Use the exact `PGHOST` / `PGPORT` / `PGDATABASE` from the Postgres plugin**  
   Railway → **Postgres** → **Variables** → copy those three into:
   - `DATASOURCE_URL=jdbc:postgresql://<PGHOST>:<PGPORT>/<PGDATABASE>?sslmode=require`

2. **Same project & networking**  
   Backend and Postgres must be in the **same Railway project**. Private hostnames only work across linked services / private network. If internal host keeps failing, use the **public** host from the Postgres **Connect** tab (often `*.rlwy.net` / `proxy.rlwy.net` style) in `DATASOURCE_URL` instead of `.internal`.

3. **Keep `?sslmode=require`** for Railway Postgres (TLS).

4. **Redeploy after every variable change** and confirm **no typos** in host (extra space, wrong region).

5. **Optional test:** In Railway, open **Postgres → Query** or run `psql` from a one-off shell using the same host/port/user/password; if that works, use identical values in `DATASOURCE_*`.

---

## 8. Vercel frontend shows **“Failed to fetch”** (login / API)

The app works locally because the Vite **proxy** sends `/api/*` to `localhost:8080`. On Vercel there is **no proxy** — the browser calls the **Railway** origin. If that fails, you usually see **Failed to fetch** (often **CORS**, wrong API URL, or backend down).

### A. Backend must allow your **exact** Vercel origin (CORS)

On **slogbaa-backend** → **Variables**, set:

| Variable | Example |
|----------|---------|
| `CORS_ALLOWED_ORIGINS` | `https://nac-slogbaa.vercel.app` |

Rules:

- Use **`https://`** (production profile **rejects** `http://` origins).
- **No trailing slash** on the origin (`…vercel.app` not `…vercel.app/`).
- **Preview / branch URLs** are different hosts, e.g. `https://nac-slogbaa-git-fixing-dev-xxx.vercel.app`. Each must be listed, **comma-separated**:
  - `https://nac-slogbaa.vercel.app,https://nac-slogbaa-git-fixing-dev-xxx.vercel.app`
- After changing CORS, **redeploy** the backend.

Set **`PASSWORD_RESET_BASE_URL`** to the same frontend URL you use in the browser (production or preview).

### B. Frontend must **build** with the Railway API URL

`VITE_API_BASE_URL` is baked in at **`bun run build`** time, not at runtime.

- **Vercel dashboard:** Project → **Settings** → **Environment Variables** → set **`VITE_API_BASE_URL`** = `https://<your-railway-backend>.up.railway.app` (no trailing slash) for **Production** and **Preview** as needed.
- **`frontend/vercel.json`** `build.env` only applies if nothing overrides it; prefer explicit Vercel env vars for branch/preview builds.
- Redeploy the frontend after changing this.

### C. Quick checks

1. Open in browser: `https://<railway-host>/actuator/health/liveness` → should return JSON **UP**.
2. DevTools → **Network** → failed login → see request URL. If it points to **Vercel** (`nac-slogbaa.vercel.app/api/...`) then **`VITE_API_BASE_URL` was empty** at build time — fix env and rebuild.
3. If the request goes to Railway but fails with (blocked) CORS in console → fix **`CORS_ALLOWED_ORIGINS`** on Railway.

4. **PWA / service worker:** An older Workbox rule treated any `https://` URL (except Google Fonts) as a cacheable “external” request, which intercepted **Railway `https://…up.railway.app/api/…`** and caused **Failed to fetch**. This is fixed in `frontend/vite.config.js` with a **`NetworkOnly`** rule for `pathname.startsWith('/api/')`. After upgrading, redeploy Vercel once, then in Chrome **Application → Service Workers → Unregister** (or “Clear site data”) for your Vercel domain so the new SW replaces the old one.
