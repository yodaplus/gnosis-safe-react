#!/bin/bash

docker context use default

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 135135176603.dkr.ecr.ap-south-1.amazonaws.com

REACT_APP_NETWORK=apothem REACT_APP_ENV=production yarn build
docker build -f docker/Dockerfile -t 135135176603.dkr.ecr.ap-south-1.amazonaws.com/safe-transaction-service_front:apothem .
docker push 135135176603.dkr.ecr.ap-south-1.amazonaws.com/safe-transaction-service_front:apothem

REACT_APP_NETWORK=xinfin REACT_APP_ENV=production yarn build
docker build -f docker/Dockerfile -t 135135176603.dkr.ecr.ap-south-1.amazonaws.com/safe-transaction-service_front:xinfin .
docker push 135135176603.dkr.ecr.ap-south-1.amazonaws.com/safe-transaction-service_front:xinfin