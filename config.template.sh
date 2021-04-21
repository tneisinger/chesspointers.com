#!/bin/sh
# Use this file as a template to create your own "config.sh" file

# Database info - fill in with your values
DATABASE_CONNECTION=yourDbConnectionString
DATABASE_HOST=yourDatabaseHost
DATABASE_USERNAME=yourDatabaseUsername
DATABASE_PASSWORD=yourDatabasePassword
DATABASE_NAME=yourDatabaseName


# You shouldn't have to change the values below

DATABASE_PORT=5432

DOCKER_COMPOSE_BASE_FILE=".docker-compose-base.yaml"
DOCKER_COMPOSE_BASE_TEMPLATE="docker-compose-base.template.yaml"

DOCKER_COMPOSE_DEV_FILE=".docker-compose-dev.yaml"
DOCKER_COMPOSE_DEV_TEMPLATE="docker-compose-dev.template.yaml"

DOCKER_COMPOSE_PROD_FILE=".docker-compose-prod.yaml"
DOCKER_COMPOSE_PROD_TEMPLATE="docker-compose-prod.template.yaml"

NODE_DIR="./services/node"
NODE_DEV_DOCKERFILE_TEMPLATE="${NODE_DIR}/Dockerfile-dev.template"
NODE_DEV_DOCKERFILE="${NODE_DIR}/.Dockerfile-dev"
NODE_PROD_DOCKERFILE_TEMPLATE="${NODE_DIR}/Dockerfile-prod.template"
NODE_PROD_DOCKERFILE="${NODE_DIR}/.Dockerfile-prod"

CLIENT_DIR="${NODE_DIR}/src/client"
CLIENT_DOTENV_TEMPLATE="${CLIENT_DIR}/.env.template"
CLIENT_DOTENV_FILE="${CLIENT_DIR}/.env"

# The location of the project directory inside the node service docker container
NODE_PROJECT_DIR="/home/node/app"
