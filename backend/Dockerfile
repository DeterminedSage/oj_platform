FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Install Java (OpenJDK), GCC, and other necessary tools
RUN apk update && apk add --no-cache \
    g++ \
    openjdk17 \
    python3 \
    py3-pip

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Copy only the package.json and package-lock.json files and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

EXPOSE 8080

# Start your Node.js backend
CMD [ "node", "index.js" ]

