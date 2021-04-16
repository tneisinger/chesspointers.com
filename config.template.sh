#!/bin/sh

# Use this file as a template to create your own "config.sh" file

# Database info - fill in with your values
DATABASE_CONNECTION=yourDbConnectionString
DATABASE_HOST=yourDatabaseHost
DATABASE_USERNAME=yourDatabaseUsername
DATABASE_PASSWORD=yourDatabasePassword
DATABASE_NAME=yourDatabaseName
DATABASE_PORT=yourDatabasePort

# The values below shouldn't be changed

DOCKER_COMPOSE_FILE=".docker-compose.yaml"
DOCKER_COMPOSE_TEMPLATE="docker-compose.template.yaml"

NODE_DIR="./services/node"
NODE_DOCKERFILE_TEMPLATE="${NODE_DIR}/Dockerfile.template"
NODE_DOCKERFILE="${NODE_DIR}/.Dockerfile"

CLIENT_DIR="${NODE_DIR}/src/client"
CLIENT_DOTENV_TEMPLATE="${CLIENT_DIR}/.env.template"
CLIENT_DOTENV_FILE="${CLIENT_DIR}/.env"

# The location of the project directory inside the node service docker container
NODE_PROJECT_DIR="/home/node/app"
