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

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
