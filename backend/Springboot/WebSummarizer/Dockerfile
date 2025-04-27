FROM openjdk:17-slim

WORKDIR /app

# Install xargs (from findutils) and any other needed tools
RUN apt-get update && apt-get install -y findutils

COPY . .

RUN ./gradlew build

CMD ["java", "-jar", "build/libs/WebSummarizer-0.0.1-SNAPSHOT.jar"]
