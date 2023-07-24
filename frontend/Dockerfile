# Use an official Node.js runtime as the base image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy the frontend application files to the container
COPY ./package.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend application files to the container
COPY . ./

# Build the frontend (you may need to adjust this based on your frontend setup)
RUN npm run build

# Use a lightweight Nginx image to serve the frontend
FROM nginx:alpine

# Copy the frontend build files to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
