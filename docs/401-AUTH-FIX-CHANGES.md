# 401 Unauthorized Fix — Change Summary

This document summarizes the changes made to resolve persistent 401 Unauthorized errors when accessing admin endpoints (e.g. Add module, GET /api/admin/courses) even after fresh logins.

---

## IAM Module

### 1. CORS Configuration

**File:** `iam/src/main/java/com/nac/slogbaa/iam/config/IamSecurityConfiguration.java`

**Problem:** Cross-origin requests (e.g. frontend at `http://localhost:5173` calling backend at `http://localhost:8080` without proxy) can fail because:
- The browser sends a preflight `OPTIONS` request before the actual request.
- Without CORS configuration, the server may reject or fail the preflight, leading to 401.
- The `Authorization` header is not sent by default in cross-origin requests unless the server explicitly allows it.

**Solution:** Added a `CorsConfigurationSource` bean and enabled CORS in the security filter chain:
- **Allowed origins:** Configurable via `app.cors.allowed-origins` (default: `http://localhost:5173`, `http://localhost:3000`)
- **Allowed methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Allowed headers:** Authorization, Content-Type, Accept
- **Credentials:** `allowCredentials(true)` — required when sending Authorization header from a different origin
- **Preflight cache:** `maxAge(3600)` — browser caches preflight for 1 hour

**Spring Boot concepts:**
- `CorsConfigurationSource` — defines CORS rules for the application
- `UrlBasedCorsConfigurationSource` — registers CORS config per path pattern
- `HttpSecurity.cors()` — integrates the CORS filter into the security chain so preflight requests are handled before authentication

---

### 2. Improved 401 Response Body

**File:** `iam/src/main/java/com/nac/slogbaa/iam/config/IamSecurityConfiguration.java`

**Problem:** The default `response.sendError(401)` returns a minimal response body. Clients show generic "Request failed (401)" with no actionable message.

**Solution:** Custom `authenticationEntryPoint` now returns a JSON body:
```json
{"detail":"Authentication required. Please log in or provide a valid token."}
```

**Spring Boot concepts:**
- `AuthenticationEntryPoint` — invoked when an unauthenticated user accesses a protected resource
- `HttpServletResponse` — set status, content type, and write JSON body for API clients

---

### 3. JWT Token Normalization

**File:** `iam/src/main/java/com/nac/slogbaa/iam/adapters/security/JwtAuthenticationFilter.java`

**Problem:** When using API clients (Postman, Thunder Client, etc.), users may paste the full `Authorization` header value (`Bearer eyJ...`) into the "Token" field. The client then sends `Authorization: Bearer Bearer eyJ...`. The filter extracted `Bearer eyJ...` as the token, which fails JWT parsing (malformed).

**Solution:** After extracting the token, strip any leading `"Bearer "` prefix:
```java
if (token.toLowerCase().startsWith("bearer ")) {
    token = token.substring(7).trim();
}
```

**Spring Boot concepts:**
- `OncePerRequestFilter` — ensures the filter runs once per request
- Request header parsing and normalization before passing to the JWT parser

---

### 4. JWT Parse Failure Logging

**File:** `iam/src/main/java/com/nac/slogbaa/iam/adapters/security/JwtTokenAdapter.java`

**Problem:** When JWT parsing failed (expired, malformed, bad signature), no logging occurred. Debugging 401s required guessing the cause.

**Solution:** Added SLF4J debug logging for each failure type:
- `ExpiredJwtException` — "JWT expired"
- `MalformedJwtException` / `SignatureException` — "JWT invalid (malformed or bad signature)"
- `IllegalArgumentException` — "JWT parse error"

**Spring Boot concepts:**
- SLF4J / Logback — standard logging; `log.debug()` only logs when `logging.level.com.nac.slogbaa=DEBUG` is set (e.g. in `application-dev.properties`)

---

### 5. JWT Rejection Warning (Filter)

**File:** `iam/src/main/java/com/nac/slogbaa/iam/adapters/security/JwtAuthenticationFilter.java`

When an `Authorization` header is present but `parseToken` returns empty, the filter now logs at WARN:
```
JWT token rejected for POST /api/admin/courses/.../modules — check logs above for parse failure (expired/malformed/signature)
```
This helps trace 401s: the JwtTokenAdapter debug log (above) explains the specific failure.

---

## App Module

### 6. CORS Configuration Property

**File:** `app/src/main/resources/application.properties`

**Addition:**
```properties
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
```

**Spring Boot concepts:**
- `@Value` resolution — `${CORS_ALLOWED_ORIGINS:default}` reads env var or uses default
- Externalized configuration — production can set `CORS_ALLOWED_ORIGINS` for the deployed frontend URL(s)

---

## React / Vite Concepts Used

### Frontend (No Code Changes)

The frontend already:
- Uses `apiClient(token)` to attach `Authorization: Bearer <token>` to all requests
- Parses `body.detail` from error responses for user-friendly messages
- Stores the token in `localStorage` via `AuthContext` and passes it through `Outlet` context to admin pages

**Vite proxy** (`frontend/vite.config.js`): In development, `/api` and `/auth` are proxied to `http://localhost:8080`. The browser sends requests to the same origin (`localhost:5173`), so CORS is not involved when the proxy is used. CORS applies when:
- The frontend runs on a different port without proxy
- Production: frontend and backend are on different domains

**React concepts:**
- `useOutletContext()` — receives `token` from the parent layout’s `Outlet` context
- `AuthContext` — provides `token` from `localStorage` after login

---

## Verification Steps

1. **Backend:** Restart the Spring Boot app.
2. **Login:** Log in as SUPER_ADMIN. Seed credentials: `superadmin@slogbaa.nac.go.ug` / `password`.
3. **Add module (UI):** Open a course → Add module → Fill form → Add module. Should succeed.
4. **Add module (Postman):**
   - POST `http://localhost:8080/auth/login` with body: `{"email":"superadmin@slogbaa.nac.go.ug","password":"password"}`
   - Copy the `token` value from the response (the raw JWT string only, no quotes).
   - POST `http://localhost:8080/api/admin/courses/{courseId}/modules`
   - **Authorization:** Type = Bearer Token, paste the token (Postman adds "Bearer " automatically).
   - **Body:** `{"title":"My Module","description":"...","moduleOrder":0,"hasQuiz":false}`
5. **Debug logs:** If 401 persists, check backend logs. You should see: `JWT token rejected for POST /api/admin/courses/.../modules`. The line above it (from JwtTokenAdapter) will say why: "JWT expired", "JWT invalid (malformed or bad signature)", etc.

---

## Troubleshooting 401

| Symptom | Cause | Fix |
|--------|-------|-----|
| 401 in Postman | Wrong credentials | Use `superadmin@slogbaa.nac.go.ug` / `superadmin123` (seed data) |
| 401 in Postman | Token not sent | Auth type = Bearer Token, paste **only** the token (no "Bearer ") |
| 401 in Postman | Old/expired token | Login again and copy the new token |
| 401 in UI | Stale token in localStorage | Log out, clear `localStorage`, log in again |
| 401 in UI | Logged in as trainee | Add module requires SUPER_ADMIN; use staff account |
| "JWT expired" in logs | Token older than 24h | Log in again |
| "JWT invalid (malformed)" | Token truncated or wrong format | Copy the full token; ensure no extra spaces or quotes |

---

## See also
- [Content Block Lifecycle](CONTENT-BLOCK-LIFECYCLE.md) – Flow from admin adding content blocks to trainee viewing them, and why content may not appear in the DB.

---

## Concepts Reference

| Concept | Spring Boot / Backend | React / Vite |
|--------|------------------------|--------------|
| CORS | `CorsConfigurationSource`, `HttpSecurity.cors()` | N/A (browser enforces) |
| JWT | `JwtAuthenticationFilter`, `AuthTokenPort`, `parseToken` | `Authorization: Bearer <token>` header |
| Security filter chain | `SecurityFilterChain`, `addFilterBefore` | N/A |
| Error response | `AuthenticationEntryPoint`, `HttpServletResponse` | `fetch().then(res => res.json())`, `body.detail` |
| Config externalization | `@Value`, `application.properties`, env vars | `import.meta.env.VITE_*` |
| Dev proxy | N/A | Vite `server.proxy` |
| State/auth | N/A | `AuthContext`, `localStorage`, `Outlet` context |
