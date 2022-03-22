# !/bin/sh -eu 
set -a
. ./.env_swarm
docker stack deploy -c docker-compose-swarm.yml drone-server
container=$(docker ps --filter name='zookeeper3' -aq)
ids=`docker exec -i $container bash -c "zookeeper-shell zookeeper1:22181 ls /brokers/ids 2>/dev/null"` 
while [[ $ids != *"[1, 2, 3]"* ]]
do
  ids=`docker exec -i $container bash -c "zookeeper-shell zookeeper1:22181 ls /brokers/ids 2>/dev/null"`
done
docker stack deploy -c docker-compose-swarm2.yml drone-server
