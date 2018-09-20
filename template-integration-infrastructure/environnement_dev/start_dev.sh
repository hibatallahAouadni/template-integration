#!/usr/bin/env bash

chmod u+x pre-commit
cp pre-commit .git/hooks/pre-commit
export DEVELOPPER=$(whoami)
docker-compose -f $(pwd)/template-integration-infrastructure/environnement_dev/docker-compose.yml down -v
sleep 20
docker-compose -f $(pwd)/template-integration-infrastructure/environnement_dev/docker-compose.yml up --build