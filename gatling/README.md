# Protocole de test architecture avec gatling

## setup gatling
- être sur la branch main du projet 
- aller dans le sous dossier gatling copier le contenu du dossier dans "gatling-charts-highcharts-bundle-3.7.3\user-files\simulations"

## lancer une simulation
- lancer gatling.bat
- entrer le numero correspondant a la simulation "KafkaSimulationPosition"
- entrer la descrpition de votre choix

## Résultat attendu
- Tous les messages sont bien envoyé sur le bus
- vous pouvez vérifier en ouvrant localhost:8080 
- aller dans la section topics vous verrez que le topics position.changed a bien reçu tous ces messages
- Aller ensuite ouvrir mongoDB vous verrez la par contre que seul une partie des positions a pu être bien enregistré mais vous pouvez aussi remarque qu'après avoir appuyer sur refresh  le nombre de position se met à jour
