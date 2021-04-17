#!/bin/sh

# make docker-compose files and bring in the config variables
. ./.makeDockerComposeFiles.sh

# Set the name of the docker-compose project, noting that it is DEV
export COMPOSE_PROJECT_NAME="ChessPointers_dev"

# run docker-compose using the DOCKER_COMPOSE_FILE from config.sh
docker-compose -f $DOCKER_COMPOSE_BASE_FILE -f $DOCKER_COMPOSE_DEV_FILE $@
