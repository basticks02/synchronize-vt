# Use an official Node.js image from Docker Hub
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files into the container
COPY backend/ .

# Expose the application port (if needed)
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
