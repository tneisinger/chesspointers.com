#!/bin/sh

# make docker-compose files and bring in the config variables
. ./.makeDockerComposeFiles.sh

# run docker-compose using the DOCKER_COMPOSE_FILE from config.sh
docker-compose -f $DOCKER_COMPOSE_BASE_FILE -f $DOCKER_COMPOSE_PROD_FILE $@
