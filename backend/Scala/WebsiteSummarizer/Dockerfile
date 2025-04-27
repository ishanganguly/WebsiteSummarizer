FROM openjdk:17-slim

# Set timezone (e.g., Asia/Kolkata)
ENV TZ=Asia/Kolkata

# Install tzdata and xargs (via findutils)
RUN apt-get update && apt-get install -y \
    tzdata \
    findutils && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get clean

WORKDIR /app

COPY gradlew ./gradlew
COPY gradle ./gradle/
COPY . .

RUN chmod +x gradlew
RUN ./gradlew shadowJar

CMD ["java", "-jar", "app/build/libs/app.jar"]
