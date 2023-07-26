#!/bin/bash

# Remove all running containers
sudo docker rm -f $(docker ps -aq)

# Remove all unused images
sudo docker rmi -f $(docker images -aq)

# Remove unused resources
sudo docker system prune -af --volumes

# NOTE: Current volume (data) will be keep
