yellow='\033[0;33m'
blue="\033[0;36m"
magenta="\033[0;35m"
purple="\e[0;35m"
red="\e[0;31m"
none='\033[0m' 


echo -e "${magenta}--- SCENARIO 1 ---"
echo -e "${yellow}Louis receptionne sa commande lors de forte affluence sur le réseaux"
echo -e "\n"

[[ -f saved_value ]] || echo 0 > saved_value
orderId=$(< saved_value)
echo -e "Le système de livraison par drone prend en charge la livraison de la commande de louis lors d’un pic d’utilisation du réseau"
echo -e "${blue}Send POST request to the delivery-planner service with command destination,orderId, deliveryDate ${none}"
droneAffect=$(curl --silent http://localhost:4005/command -H "Content-type:application/json" -X POST -d "{\"deliveryPoint\":{\"latitude\" : 0.3,\"longitude\" : 0.3},\"clientId\": \"1\",\"deliveryDate\" : null,\"orderId\" : \"$orderId\"}")
echo -e "drone$droneAffect effectue la livraison" 
echo -e "\n"
sleep 3

echo -e "${yellow}Louis peut voir la position du drone pendant de la livraison ${none}"
echo -e "${yellow}et peut constater le changement de statut de sa livraison ${none}"
echo -e "${blue}Send GET request to the delivery-status service to obtain drone current status and position${none}"
for i in `seq 1 5`
do
    suivit $orderId
    sleep 1
done
sleep 3
echo -e "${yellow}Le drone étant defectueux, il envoie aléatoirement des positions erronés, ces positions ne sont pas stockées et les erreurs sont remontées${none}"
echo -e "${blue} drone TCP request on bus kafka with bad position ${none}"
curl --silent http://localhost:4006/ -H "Content-type:application/json" -X POST -d "{\"topic\":\"position.changed\",\"message\": {\"droneId\":\"$droneAffect\", \"position\":{\"latitude\" : 0.4,\"longitude\" : 0.4}}}"
docker logs position-alert-listener --tail 1

echo -e "${yellow}En raison de la charge, le service drone-position tombe${none}"
sleep 3
docker stop drone-position
begDate=$(date +"%Y-%m-%dT%H:%M:%S")
echo -e "${blue}date de fin de fonctionnement${red}  $begDate ${none}"
echo -e "${blue}Louis & Elon peuvent toujours suivre la position des drones ${none}"
sleep 2
for i in `seq 1 5`
do
    suivit $orderId
    sleep 1
done
sleep 2

echo -e "${yellow}Le service est relancé en toute transparence${none}"
docker start drone-position
reprise=$(date +"%Y-%m-%dT%H:%M:%S")
echo -e "${blue}date de de reprise du service${red} $reprise${none}"

sleep 20
echo -e "${yellow}Pendant cette chute de réseaux le drone à eu un accident impliquant le drone $droneAffect ${none}"
echo -e "${yellow}Elon verifie les positions du drone pour étudier les données de l'incident ${none}"


history=$(curl --silent http://localhost:3000/position/history?droneId=$droneAffect\&begDate=$begDate\&endDate=$reprise -X GET | python -m json.tool)
echo -e "history : $history"
echo $(( orderId + 1 )) > saved_value