# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Tải dependencies trước để cache
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Biến môi trường mặc định
ENV SERVER_PORT=8083
EXPOSE ${SERVER_PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]
