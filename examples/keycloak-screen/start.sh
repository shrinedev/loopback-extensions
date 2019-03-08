#!/usr/bin/env bash

# Install local dependencies via lerna
lerna bootstrap ../../lerna.json

# For local packages you MUST run the build commands
lerna exec -- npm run build

# Fire up LoopBack server
npm run start
