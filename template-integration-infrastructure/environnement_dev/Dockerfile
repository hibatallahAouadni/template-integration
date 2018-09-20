FROM node:8.11

RUN apt-get update
RUN apt-get install -y zip
RUN apt-get install -y wget
RUN apt-get install -y nano
RUN apt-get --yes --force-yes install git
RUN npm install -g gulp


#install sonar scanner
RUN apt-get update && apt-get install -y unzip
RUN wget https://sonarsource.bintray.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.0.3.778-linux.zip -O /tmp/sonar.zip && \
	mkdir -p /root/.sonar/native-sonar-scanner && \
	unzip /tmp/sonar.zip -d /root/.sonar/native-sonar-scanner && \
	rm /tmp/sonar.zip


ADD entrypoint.sh /entrypoint.sh
RUN chmod u+x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
