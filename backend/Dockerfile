# =============================================================================
# SLOGBAA Backend - Spring Boot multi-module Gradle build
# Build:  docker build -t slogbaa-backend ./backend
# Run:    docker run -p 8080:8080 -e JWT_SECRET=... -e DATASOURCE_URL=... slogbaa-backend
# =============================================================================

FROM eclipse-temurin:21-jdk-alpine AS build
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

RUN chmod +x gradlew && ./gradlew dependencies --no-daemon -q || true

# Copy all module sources
COPY shared-ports shared-ports
COPY infrastructure infrastructure
COPY iam iam
COPY learning learning
COPY assessment assessment
COPY progress progress
COPY app app

RUN ./gradlew :app:bootJar --no-daemon -q

# ---- Runtime ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -g 1000 app && adduser -u 1000 -G app -D app
USER app

COPY --from=build /build/app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
