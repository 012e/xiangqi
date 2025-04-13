FROM eclipse-temurin:23_37-jdk-ubi9-minimal

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw verify --fail-never

COPY src ./src
RUN ./mvnw package -DskipTests -o

ENTRYPOINT ["java", "-jar", "./target/ctuong-backend.jar"]