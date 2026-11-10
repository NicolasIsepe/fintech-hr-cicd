FROM node:24-bookworm-slim AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN VITE_API_URL=/ VITE_USE_HASH_ROUTER=true npm run build

FROM eclipse-temurin:21-jdk AS backend
WORKDIR /app
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline
COPY backend/src/ src/
COPY --from=frontend /app/dist/ src/main/resources/static/
RUN ./mvnw -B package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
ENV SPRING_WEB_RESOURCES_ADD_MAPPINGS=true
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
