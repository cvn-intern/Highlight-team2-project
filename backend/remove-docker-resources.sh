#!/bin/bash

# Down all docker container
sudo docker compose -f /home/ubuntu/backend/docker-compose.yaml down

# Remove all docker resources
sudo docker rm -f $(docker ps -aq)
sudo docker rmi -f $(docker images -aq)
sudo docker volume prune -f
sudo docker network prune -f
sudo docker system prune -af --volumes
