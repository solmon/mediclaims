#!/bin/bash
cp ./binary_ubuntu/* .
export FABRIC_CFG_PATH=$PWD
sh ./ibm_fabric.sh
sh ./docker-images.sh
sleep 5
export COMPOSE_PROJECT_NAME='blockchain'
export LOCALCONFIG=true
docker-compose up -d
