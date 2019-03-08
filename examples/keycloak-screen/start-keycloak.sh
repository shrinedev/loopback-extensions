#!/usr/bin/env bash

# Start up Keycloak and Postgres
docker-compose -f keycloak/docker-compose.yml up

# Install local dependencies via lerna
# lerna bootstrap ../../lerna.json

# # Fire up
# npm run start
