yellow='\033[0;33m'
blue="\033[0;36m"
magenta="\033[0;35m"
purple="\e[0;35m"
red="\e[0;31m"
none='\033[0m' 


echo -e "${magenta}--- SCENARIO 4 ---"
echo -e "${yellow}Louis passe sa commande lors de forte affluence sur le réseaux"
echo -e "\n"
sleep 2
echo -e "Le service permettant de connaître les drones disponible tombe${red}"
docker stop drone-park-manager
echo -e "${blue}Send request to the drone-park-manager${none}"
echo -e $(curl -I  http://localhost:4004/positions/available)
docker start drone-park-manager
sleep 4
echo -e "${yellow}La commande de Louis reçue"
echo -e "${blue}Send POST request to the delivery-planner service with command destination,orderId, deliveryDate, clientId ${none}"
sleep 4 | docker logs delivery-planner --tail 26 & droneAffect=$(curl --silent http://localhost:4008/api/command -H "Content-type:application/json" -X POST -d "{\"deliveryPoint\":{\"latitude\" : 0.3,\"longitude\" : 0.3},\"clientId\": \"1\",\"deliveryDate\" : null,\"orderId\" : 4}") 
echo -e "${yellow}le service permettant de connaître les drones disponibles a redemarré\n${none}"
sleep 4
docker logs delivery-planner --tail 20
echo -e "${yellow}le drone n°$droneAffect effectue la livraison" 
echo -e "\n"
sleep 3
