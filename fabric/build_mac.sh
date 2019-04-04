#!/bin/bash
cp ./binary_mac/* .
export FABRIC_CFG_PATH=$PWD
sh ./generate-certs.sh
sh ./docker-images.sh
export COMPOSE_PROJECT_NAME='blockchain'
export LOCALCONFIG=true
docker-compose -p blockchain up -d
