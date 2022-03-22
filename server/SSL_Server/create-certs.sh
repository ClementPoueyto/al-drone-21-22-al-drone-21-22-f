#!/bin/bash
rm -f ./*.crt ./*.csr ./*_creds ./*.jks ./*.srl ./*.key ./*.pem ./*.der ./*.p12 

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

# Generate CA key.
openssl req -new -x509 -keyout ca.key -out ca.crt -days 365 -passin pass:ArchiServer -passout pass:ArchiServer



for i in broker client
do
	echo $i
	# Create keystores.
	keytool -genkey -noprompt \
				 -alias $i \
				 -dname "CN=$i.drone.teamf.al, OU=TeamF, O=AL-SI5, L=Sophia, S=06, C=FR" \
				 -keystore kafka.$i.keystore.jks \
				 -keyalg RSA \
				 -storepass ArchiServer \
				 -keypass ArchiServer

	# Create CSR.
	keytool -keystore kafka.$i.keystore.jks -alias $i -certreq -file $i.csr -storepass ArchiServer -keypass ArchiServer

	# Sign CSR with the CA.
	openssl x509 -req -CA ca.crt -CAkey ca.key -in $i.csr -out $i-ca-signed.crt -days 9999 -CAcreateserial -passin pass:ArchiServer

	# Import CA to keystore.
	keytool -keystore kafka.$i.keystore.jks -alias CARoot -import -file ca.crt -storepass ArchiServer -keypass ArchiServer
    
	# Import the signed CSR to keystore
	keytool -keystore kafka.$i.keystore.jks -alias $i -import -file $i-ca-signed.crt -storepass ArchiServer -keypass ArchiServer

	# Create truststore and import the CA cert.
	keytool -keystore kafka.$i.truststore.jks -alias CARoot -import -file ca.crt -storepass ArchiServer -keypass ArchiServer

  echo "ArchiServer" > ${i}_sslkey_creds
  echo "ArchiServer" > ${i}_keystore_creds
  echo "ArchiServer" > ${i}_truststore_creds
done