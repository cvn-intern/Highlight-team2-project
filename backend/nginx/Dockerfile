# Use the official Nginx base image
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration to the container
COPY ./default.conf /etc/nginx/conf.d/

# Expose the port that Nginx will listen on (usually 80)
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
