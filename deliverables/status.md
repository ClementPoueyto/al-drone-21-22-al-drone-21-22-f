**distribution of points**
 - Dina Abakkali : 100
 - Florian Striebel : 100
 - Sylvain Marsili : 100
 - Thomas Martin : 100
 - Clement Poueyto : 100

**team organization**

 - Robustness and load testing : Thomas
 - Swarm : Sylvain
 - Gatling and MongoDB Cluster : Florian
 - Snort : Dina
 - API Gateway and resilience patterns : Clément

**_22/02/2022_**

**Achieved:**
 - Snort and gatling scenario
 - scenario of defective positions of a drone
 - powerpoint for presentation

**Flag:**
Green

**_15/02/2022_**

**Achieved:**
 - Presentation scenario on pattern circuit breaker with retry pattern 
 - MongoDB cluster 
**Blockers:**
 - MongoDB cluster does not store faster on a unique computer need to find another solution
**Planned for next week:**
 - Research on how to speed up MongoDB data storing
 - Research on possible substitue to MongoDB 
 - Adding chaos monkey on swarm

**Flag:**
Green



**_08/02/2022_**

**Achieved:**
 - Pattern circuit breaker with retry pattern
 - Dockerizing snort
 - MongoDB cluster configuration
 - Adding swarm on branch with security
**Blockers:**
 - Difficulties to ping snort in docker
 - Failed to connect to mongodb Cluster with the server
**Planned for next week:**
 - Relaunch drone when server detect failure
 - Adding chaos monkey on swarm
 - Work to resolve blockers

**Flag:**
Yellow



**_01/02/2022_**

**Achieved:**
 - Research on the Circuit-Breaker pattern and beginning of its implementation
 - We tested architecture limit with gatling on kafka bus and we found our weak point on the database
 - We found Pumba and Gremlins tools for chaos testing

**Planned for next week:**

 - finish implementing swarm
 - adding snort to the docker
 - Trying to mitigate ddos risk
 - Make drone reboot after receiving the order

**Flag:**
Yellow


**_25/01/2021_**

**Achieved:**
 - Drone reboot order send to the drone and acknoledgment
 - Move gateway from kafka to service connect to user
 - We installed and tested snort with ddos attack
 - We tested architecture limit with gatling on kafka bus and allows us to detect that database writting slow down bus message consumption

 **Planned for next week:**

 - Implement swarm
 - We'll continue working on the implementation of the gateway's resliency patterns/investigation on pattern discovery service
 - Trying to mitigate ddos risk
 - adding snort to the docker
 - Make drone reboot after receiving the order

**Flag:**

Yellow


**_18/01/2021_**

**Achieved:**
- We are working on drone reboot order
- We are implementing gateway's resiliency patterns
- We installed and tested snort, and currently working on the ddos attack
- We worked on the architecture and detected a weak point in the message consumption

**Planned for next week:**
- Implement swarm
- We'll continue working on the implementation of the gateway's resliency patterns

**Flag:**
-
Green

**_11/01/2021_**

**Achieved:**
-
- Preliminary load testing using Gatling;
- Architecture updated;
- Gateway added;
- We defined the user stories;
- We worked on the roadmap;
- We learned about chaos engineering technologies.

**Planned for next week:**
-
- More load testing;
- Add resiliency patterns to the gateway.

**Flag:**
-
Green



**_02/11/2021_**

**Achieved:**
-
- Functional CI on Github action;
- Unit testing of services with a testing database;
- Integration testing with postman;
- Beginning of demo scenario script;
- Secured SSL communication;
- Broker and zookeeper replication( for more resiliency ).

**Planned for next week:**
-
- Work more on the demo
- Prepare the presentation

**Blockers:**
-
- Difficulties encountered while integration testing with microservices architecture,using kafka and 2 docker-compose

**Flag:**
-
Green


**_26/10/2021_**

**Achieved:**
-

- We've achieved the delivery : we receive a command, an itinerary, this information is sent to the drone. The drone move to the client, deliver the packages and return to the base;
- Resiliency when dronePosition is down;
- Robustness on position data;
- Secure communication channel between drone and the server.

**Planned for next week:**
-
- Automation of scenarios;
- Add parameters to kafka to be more resilient on brokers down;
- CI and test.

**Risks:**
-
- Don't be able to produce enough test and a good CI.

**Flag:**
-
Yellow





**_19/10/2021_**

**Achieved:**
-

- We created drone services, server services and started to implement kafka
- Communication between 2 docker compose
- Drone can send status informations ( current position ) in the bus and receive itinerary

**Planned for next week:**
-
- We will continue to implement US 1, US 2 and US3
- We will realize a basic transverse scenario through all our services

**Blockers:**
-
- We had trouble understanding how kafka works;
- We had trouble finding how to communicate with kafka through 2 docker compose and to adapt ip address for docker.

**Risks:**
-
- Is to deliver useless technical things instead of value;
- Is to not produce scenario.

**Flag:**
-
-Red

**_12/10/2021_**

**Achieved:**
-
- Refactoring of the architecture;
- Better explanation on architecture choices;
- Redo planning to implement first important US and difficult parts;
- Research on spike https.

**Planned for next week:**
-
- Well start to set-up project with kafka;
- We will implement US.1, US.2, US.3 and US.4.

**Flag:**
-
Red

**_05/10/2021_**

**Achieved:**
-
- We worked on the architecture diagram;
- We redefined the personas;
- We worked on making user stories better ;
- We defined the acceptance criterias for our US;
- We prepared the roadmap.

**Planned for next week:**
-
- We'll start working on the walking skeleton;
- Improve the architecture diagram.

**Flag:**
-
Green  
  

**_27/09/2021_**

**Achieved:**
-
- Brainstorming of the systems's functionalities;
- We defined the personas;
- We defined the user stories related to our variant;
- We defined the scope;
- We worked on finding relevant scenarios.

**Planned for next week:**
-
- We'll start working on the component diagram and the roadmap;
- We'll choose the stack.

**Flag:**
-
Green


