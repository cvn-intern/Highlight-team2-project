# Use an official Node.js runtime as the base image
FROM node:18 as backend

# Set the working directory in the container
WORKDIR /app

# Copy the backend application files to the container
COPY ./package.json ./package-lock.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend application files to the container
COPY . ./

# Build the backend application for production
RUN npm run build

# Expose the port your backend application
EXPOSE 3000
EXPOSE 3001

# Start the backend application when the container runs
CMD ["npm", "run", "start:prod"]
