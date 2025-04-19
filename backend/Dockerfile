# === Build Stage ===
FROM eclipse-temurin:23_37-jdk-ubi9-minimal AS builder

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw verify --fail-never

COPY src ./src
RUN ./mvnw package -DskipTests -o

# === Runtime Stage ===
FROM eclipse-temurin:23_37-jre-ubi9-minimal

WORKDIR /app

# Copy only the built jar from the builder stage
COPY --from=builder /app/target/ctuong-backend.jar ./ctuong-backend.jar

ENTRYPOINT ["java", "-jar", "./ctuong-backend.jar"]

