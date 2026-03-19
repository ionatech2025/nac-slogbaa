# syntax=docker/dockerfile:1
# =============================================================================
# SLOGBAA Backend - Spring Boot 4 multi-module Gradle build
# Build:  docker build -t slogbaa-backend ./backend
# Run:    docker run -p 8080:8080 -e JWT_SECRET=... -e DATASOURCE_URL=... slogbaa-backend
# =============================================================================

# ---- Stage 1: Build the fat JAR ----
FROM docker.io/library/eclipse-temurin:21-jdk-alpine AS build
WORKDIR /build

# Copy Gradle wrapper and build scripts first for dependency caching
COPY gradlew gradlew.bat ./
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./
COPY shared-ports/build.gradle.kts shared-ports/build.gradle.kts
COPY infrastructure/build.gradle.kts infrastructure/build.gradle.kts
COPY iam/build.gradle.kts iam/build.gradle.kts
COPY learning/build.gradle.kts learning/build.gradle.kts
COPY assessment/build.gradle.kts assessment/build.gradle.kts
COPY progress/build.gradle.kts progress/build.gradle.kts
COPY app/build.gradle.kts app/build.gradle.kts

# Create stub source dirs so Gradle can resolve projects for dependency download
RUN mkdir -p shared-ports/src/main/java infrastructure/src/main/java \
    iam/src/main/java learning/src/main/java assessment/src/main/java \
    progress/src/main/java app/src/main/java

# Download dependencies (--continue allows partial success for stub modules)
RUN --mount=type=cache,id=slogbaa-gradle,target=/root/.gradle \
    chmod +x gradlew && ./gradlew dependencies --no-daemon --continue -q || true

# Copy all module sources
COPY shared-ports shared-ports
COPY infrastructure infrastructure
COPY iam iam
COPY learning learning
COPY assessment assessment
COPY progress progress
COPY app app

RUN --mount=type=cache,id=slogbaa-gradle,target=/root/.gradle \
    ./gradlew :app:bootJar --no-daemon -q

# ---- Stage 2: Extract Spring Boot layered JAR ----
FROM docker.io/library/eclipse-temurin:21-jdk-alpine AS extract
WORKDIR /build
COPY --from=build /build/app/build/libs/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

# ---- Stage 3: Distroless runtime ----
FROM gcr.io/distroless/java21-debian12:nonroot

LABEL org.opencontainers.image.title="slogbaa-backend" \
      org.opencontainers.image.description="NAC SLOGBAA Learning Platform - Spring Boot Backend" \
      org.opencontainers.image.source="https://github.com/ionatech2025/nac-slogbaa"

WORKDIR /app

# Copy layers individually — dependencies change rarely, application changes often.
# Docker only re-pushes layers that changed, saving bandwidth on every deploy.
COPY --link --from=extract /build/extracted/dependencies/ ./
COPY --link --from=extract /build/extracted/spring-boot-loader/ ./
COPY --link --from=extract /build/extracted/snapshot-dependencies/ ./
COPY --link --from=extract /build/extracted/application/ ./

EXPOSE 8080

# JVM container-awareness: cap heap at 75% of cgroup memory limit,
# G1GC for balanced throughput/latency, crash fast on OOM instead of limping.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
