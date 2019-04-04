#!/bin/bash

# docker rm -f $(docker ps -aq)
# images=( web insurance-peer orderer hospital-ca customer-ca insurance-ca hospital-peer customer-peer )
# for i in "${images[@]}"
# do
# 	echo Removing image : $i
#   docker rmi -f $i
# done

# #docker rmi -f $(docker images | grep none)
# images=( dev-hospital-peer dev-insurance-peer dev-customer-peer)
# for i in "${images[@]}"
# do
# 	echo Removing image : $i
#   docker rmi -f $(docker images | grep $i )
# done

docker kill $(docker ps -q)
sleep 5
docker rm $(docker ps -aq)
sleep 5
docker rmi $(docker images dev-* -q)