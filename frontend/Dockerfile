# =============================================================================
# SLOGBAA Frontend - React SPA served by nginx
# Build:  docker build -t slogbaa-frontend ./frontend
# Run:    docker run -p 3000:80 slogbaa-frontend
# =============================================================================

FROM node:24-alpine AS build
WORKDIR /app

# Install bun
RUN npm i -g bun

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# In production, API is same-origin (nginx proxies /api to backend)
ENV VITE_API_BASE_URL=
RUN bun run build

# ---- Runtime: nginx serves static SPA ----
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf ./*

# Copy built SPA
COPY --from=build /app/dist .

# SPA routing: all paths fall back to index.html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-ID $request_id;
    }

    # Proxy uploaded files to backend
    location /uploads/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
    }

    # Cache static assets aggressively
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 256;
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
