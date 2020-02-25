# Stage 1
FROM openjdk:11 as build
WORKDIR /app

COPY build.gradle settings.gradle gradlew gradle /app/

COPY . ./
RUN sh /app/gradlew build

# Stage 2
FROM openjdk:11
WORKDIR APP_HOME=/app
COPY --from=build /app/build/libs/grafka-0.0.1-SNAPSHOT.jar .
EXPOSE 9000
CMD ["java","-jar", "grafka-0.0.1-SNAPSHOT.jar"]