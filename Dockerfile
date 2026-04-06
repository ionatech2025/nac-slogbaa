# syntax=docker/dockerfile:1
# =============================================================================
# SLOGBAA Backend — monorepo root build (Railway default source = repo root)
#
# Local backend-only build (faster layer cache):  docker build -t slogbaa-backend ./backend
# Root build (Railway / full-repo context):      docker build -t slogbaa-backend .
# =============================================================================

FROM docker.io/library/eclipse-temurin:21-jdk-alpine AS build
WORKDIR /build
COPY backend/ .
# No BuildKit cache mounts: Railway requires id=s/<service-id>-… which is not portable in git.
RUN chmod +x gradlew && ./gradlew :app:bootJar --no-daemon -q

FROM docker.io/library/eclipse-temurin:21-jdk-alpine AS extract
WORKDIR /build
COPY --from=build /build/app/build/libs/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted && \
    mkdir -p /build/uploads

FROM docker.io/library/eclipse-temurin:21-jre-alpine

LABEL org.opencontainers.image.title="slogbaa-backend" \
      org.opencontainers.image.description="NAC SLOGBAA Learning Platform - Spring Boot Backend" \
      org.opencontainers.image.source="https://github.com/ionatech2025/nac-slogbaa"

WORKDIR /app

# Copy extracted layers from the 'extract' stage
COPY --from=extract /build/extracted/dependencies/ ./
COPY --from=extract /build/extracted/spring-boot-loader/ ./
COPY --from=extract /build/extracted/snapshot-dependencies/ ./
COPY --from=extract /build/extracted/application/ ./

# Ensure the uploads directory exists
RUN mkdir -p /app/uploads

EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

# Running as root to ensure we can write to the Railway volume mounted at /app/uploads.
# Railway volumes are often mounted with root ownership.
USER root

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
