# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar archivos necesarios para resolver dependencias primero (cache)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Copiar el código fuente
COPY src ./src

# Compilar el proyecto (usamos mvn directamente desde la imagen maven)
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el .jar compilado desde la etapa anterior
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
