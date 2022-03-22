package com.github.mnogu.gatling.kafka.test

import io.gatling.core.Predef._
import org.apache.kafka.clients.producer.ProducerConfig
import scala.concurrent.duration._

import com.github.mnogu.gatling.kafka.Predef._

import java.io.{ByteArrayInputStream, ByteArrayOutputStream, ObjectInputStream, ObjectOutputStream}
import java.text.SimpleDateFormat
import java.util.Calendar

class KafkaSimulationPosition extends Simulation {
  val kafkaConf = kafka
    // Kafka topic name
    .topic("position.changed")
    // Kafka producer configs
    .properties(
      Map(
        ProducerConfig.ACKS_CONFIG -> "1",
        // list of Kafka broker hostname and port pairs
        ProducerConfig.BOOTSTRAP_SERVERS_CONFIG -> "localhost:9092",

        // in most cases, StringSerializer or ByteArraySerializer
        ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG ->
          "org.apache.kafka.common.serialization.StringSerializer",
        ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG ->
          "org.apache.kafka.common.serialization.StringSerializer",

        "security.protocol" -> "SASL_SSL",
        "ssl.truststore.location" ->"../user-files/simulations/SSL_Client/kafka.client.truststore.jks",
        "ssl.truststore.password" ->"ArchiServer",
        "ssl.keystore.location" -> "../user-files/simulations/SSL_Client/kafka.client.keystore.jks",
        "ssl.keystore.password" ->"ArchiServer",
        "ssl.key.password" ->"ArchiServer",
        "sasl.mechanism" -> "PLAIN",
        "sasl.jaas.config"-> "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"admin\" password=\"admin-secret\";",
        "ssl.endpoint.identification.algorithm" -> ""
 ))
  
  val cal = Calendar.getInstance
  val dateTime = cal.getTime
  val dateFormat = new SimpleDateFormat("YYYY-MM-DD")
  val hourFormat = new SimpleDateFormat("hh:mm:ss.000")
  val scn = scenario("Kafka Test")
    .exec(
      kafka("request")
        .send(StringBody(s"""{ "droneId": 1, "timestamp" : "${dateFormat.format(dateTime)+"T"+hourFormat.format(dateTime)+"Z"}", "position" : { "latitude" : 0.01,  "longitude" : 0.0 } }""")))
  setUp(
    scn
      .inject(constantUsersPerSec(10000) during(90.seconds)))
    .protocols(kafkaConf)
}



/*

        "security.protocol" -> "SASL_SSL",
        "ssl.truststore.location" ->"./SSL_Client/client.truststore.jks",
        "ssl.truststore.password" ->"ArchiServer",
        "ssl.keystore.location" -> "./SSL_Client/client.keystore.jks",
        "ssl.keystore.password" ->"ArchiServer",
        "ssl.key.password" ->"ArchiServer",
        "sasl.mechanism" -> "PLAIN",
        "sasl.jaas.config"-> "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"admin\" password=\"admin-secret\""
        

*/