#!/bin/sh

CONFIG_FILE=./config.sh
CONFIG_FILE_TEMPLATE=./config.template.sh

if [ -f "$CONFIG_FILE" ]; then
  # If the config file exists, pull in the config variables
  . $CONFIG_FILE
else
  # If the config file does not exist, throw an error and exit
  echo "ERROR: No '$CONFIG_FILE' file exists."
  echo "Create a $CONFIG_FILE file based on $CONFIG_FILE_TEMPLATE"
  exit 1
fi

makeFileFromTemplate () {
eval "cat << EOF
# DO NOT EDIT THIS FILE!
# This file is generated automatically by $(readlink -f $0).
$(cat $1)
EOF
" > $2
}

# Create the docker-compose file
makeFileFromTemplate $DOCKER_COMPOSE_TEMPLATE $DOCKER_COMPOSE_FILE

# Create the Dockerfile for the node service
makeFileFromTemplate $NODE_DOCKERFILE_TEMPLATE $NODE_DOCKERFILE

# Create the .env file for the client part of the node service
makeFileFromTemplate $CLIENT_DOTENV_TEMPLATE $CLIENT_DOTENV_FILE

# run docker-compose using the DOCKER_COMPOSE_FILE from config.sh
docker-compose -f $DOCKER_COMPOSE_FILE $@
