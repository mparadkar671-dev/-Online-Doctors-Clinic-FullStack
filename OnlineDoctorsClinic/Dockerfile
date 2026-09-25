# ==============================================================================
# Multi-Stage Production Dockerfile for Spring Boot 3 & Java 21
# Compatible with Render, Railway, Fly.io, and Docker Compose
# ==============================================================================

# Build Stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and build production jar
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Runtime Stage (Lightweight JRE)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S clinic && adduser -S clinic -G clinic
USER clinic

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
