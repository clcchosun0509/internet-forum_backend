FROM ubuntu:20.04

RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install curl -y

WORKDIR /
COPY docker-entrypoint.sh /
COPY elastic-config-user.json /
COPY elastic-config-post.json /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]