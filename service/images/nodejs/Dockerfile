FROM ubuntu:16.04
MAINTAINER Rodrigo Pinheiro Matias

RUN locale-gen pt_BR.UTF-8 && \
    /usr/sbin/useradd -m -s /bin/bash user

ENV PATH=$PATH:/opt/node/bin \
    LANG=pt_BR.UTF-8 \
    LANGUAGE=pt_BR.UTF-8 \
    LC_ALL=pt_BR.UTF-8

RUN apt update && \
    apt install wget xz-utils ca-certificates -y && \
    wget https://nodejs.org/dist/v6.7.0/node-v6.7.0-linux-x64.tar.xz && \
    mkdir /opt/node && \
    tar xvf node-v6.7.0-linux-x64.tar.xz --strip-components=1 -C /opt/node && \
    rm node-v6.7.0-linux-x64.tar.xz && \
    /opt/node/bin/npm install grunt-cli -g && \
    apt-get autoremove -y && \
    apt-get autoclean


VOLUME /app

USER user
WORKDIR /app

ENTRYPOINT ["/opt/node/bin/npm"]

CMD ["run", "start"]
