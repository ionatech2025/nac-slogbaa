# -----------------------------------------------------------------------------
# SLOGBAA: single image = backend (Spring Boot) + frontend (React) + PostgreSQL via env
# Build: docker build -t slogbaa .
# Run:   set DATASOURCE_* and JWT_SECRET, then docker run -p 8080:8080 slogbaa
# -----------------------------------------------------------------------------

# ---- Frontend ----
FROM node:20-alpine AS frontend
WORKDIR /fe
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
# Same-origin API in production (backend serves this app)
ENV VITE_API_BASE_URL=
RUN npm run build

# ---- Backend (multi-module: iam + app) ----
FROM maven:3.9-eclipse-temurin-21-alpine AS backend
WORKDIR /build

COPY pom.xml .
COPY iam iam
COPY app app

# Inject built frontend so Spring Boot serves it from /
RUN rm -rf app/src/main/resources/static
COPY --from=frontend /fe/dist app/src/main/resources/static

RUN mvn package -pl app -am -DskipTests -B -q

# ---- Runtime ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -g 1000 app && adduser -u 1000 -G app -D app
USER app

COPY --from=backend /build/app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
