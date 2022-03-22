yellow='\033[0;33m'
blue="\033[0;36m"
magenta="\033[0;35m"
none='\033[0m' 


echo -e "${magenta}--- SCENARIO 3 ---"
echo -e "${yellow}L’outil de planification de commande envoie les informations de livraison"
echo -e "\n"
orderId=$(< saved_value)
echo -e "${blue}Send POST request to the delivery-planner service with command destination,orderId, deliveryDate ${none}"
droneAffect=$(curl --silent http://localhost:4005/command -H "Content-type:application/json" -X POST -d "{\"deliveryPoint\":{\"latitude\" : 0.3,\"longitude\" : 0.3},\"clientId\": \"1\",\"deliveryDate\" : null,\"orderId\" : \"3\"}")
echo -e $droneAffect
echo -e "\n"
sleep 4

echo -e "${yellow}Le drone décolle avec le colis et communique sa position durant le trajet ${none}"
docker logs delivery-status --tail 15

echo -e "${yellow} Louis accède à la position du drone durant la livraison ${none}"

echo $(( orderId + 1 )) > saved_value
