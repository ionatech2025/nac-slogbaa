# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy pom and download dependencies (cached unless pom changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn package -DskipTests -B

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -g 1000 app && adduser -u 1000 -G app -D app
USER app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
