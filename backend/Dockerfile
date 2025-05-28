# === Build Stage ===
FROM eclipse-temurin:23_37-jdk-ubi9-minimal AS builder

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN --mount=type=cache,target=/root/.m2 ./mvnw dependency:resolve -U
RUN --mount=type=cache,target=/root/.m2 ./mvnw verify -U --fail-never

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 ./mvnw package -U -DskipTests -o

# === Runtime Stage ===
FROM eclipse-temurin:23_37-jre-ubi9-minimal

RUN curl https://github.com/fairy-stockfish/Fairy-Stockfish/releases/latest/download/fairy-stockfish-largeboard_x86-64 -L > /usr/local/bin/fairy-stockfish && \
    chmod +x /usr/local/bin/fairy-stockfish

WORKDIR /app

# Copy only the built jar from the builder stage
COPY --from=builder /app/target/ctuong-backend.jar ./ctuong-backend.jar

ENTRYPOINT ["java", "-jar", "./ctuong-backend.jar"]

