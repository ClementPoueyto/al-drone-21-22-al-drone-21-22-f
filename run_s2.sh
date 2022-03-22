yellow='\033[0;33m'
blue="\033[0;36m"
magenta="\033[0;35m"
purple="\e[0;35m"
none='\033[0m' 


echo -e "${magenta}--- SCENARIO 2 ---"
echo -e "${yellow}Un attanquant tente de modifier le trajet du drone en cours de livraison mais la sécurité est activé"
echo -e "\n"
echo -e "${blue}Send POST request to the delivery-planner service with command destination,orderId, deliveryDate ${none}"
echo -e "${purple}Client deliveryPoint {\"latitude\" : 0.3,\"longitude\" : 0.3} ${none}"
orderId=$(< saved_value)
droneAffect=$(curl --silent http://localhost:4005/command -H "Content-type:application/json" -X POST -d "{\"deliveryPoint\":{\"latitude\" : 0.3,\"longitude\" : 0.3},\"clientId\": \"1\",\"deliveryDate\" : null,\"orderId\" : \"$orderId\"}")
echo -e "Livraison affecté a drone $droneAffect"

sleep 4
for i in `seq 1 3`
do
    suivit $orderId
    sleep 1
done
echo -e 
echo -e "${yellow}Un utilisateur malveillant envoie des paquets frauduleux en se faisant passer pour le serveur et change l’itinéraire du drone"
echo -e "${blue}Attacker send a request of planning.update  on kafka with command destination,orderId, deliveryDate ${none}"
echo -e "${purple}Attacker deliveryPoint {\"latitude\" : -0.2,\"longitude\" : -0.2} ${none}\n"
attack=$(curl --silent http://localhost:4006/ -H "Content-type:application/json" -X POST -d "{\"topic\":\"planning.update\",\"message\":{\"itinerary\":[{\"latitude\" : -0.1,\"longitude\" : -0.1},{\"latitude\" : -0.2,\"longitude\" : -0.2}],\"droneId\": \"$droneAffect\",\"orderId\" : \"$orderId\"}}")
echo -e "${yellow} L'attaquant ne peut pas se connecter au bus pour envoyer son message${none}"
sleep 1
docker logs kafka-message-producer >/dev/null
sleep 2
echo -e 
echo -e "${yellow}Le drone continue sa livraison vers sa 1er destination${none}"
echo -e $attack
for i in `seq 1 10`
do
    suivit $orderId
    sleep 1
done
echo $(( orderId + 1 )) > saved_value

