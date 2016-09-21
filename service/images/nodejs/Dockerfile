FROM ubuntu:16.04
MAINTAINER Rodrigo Pinheiro Matias

RUN apt update && \
    apt install wget xz-utils ca-certificates -y && \
    wget https://nodejs.org/dist/v4.4.5/node-v4.4.5-linux-x64.tar.xz && \
    mkdir /opt/node && \
    tar xvf node-v4.4.5-linux-x64.tar.xz --strip-components=1 -C /opt/node && \
    rm node-v4.4.5-linux-x64.tar.xz && \
    /opt/node/bin/npm install grunt-cli -g && \
    apt-get autoremove -y && \
    apt-get autoclean

RUN locale-gen pt_BR.UTF-8 && \
    /usr/sbin/useradd -m -s /bin/bash user

ENV PATH=$PATH:/opt/node/bin \
    LANG=pt_BR.UTF-8 \
    LANGUAGE=pt_BR.UTF-8 \
    LC_ALL=pt_BR.UTF-8

VOLUME /app

USER user
WORKDIR /app

ENTRYPOINT ["/opt/node/bin/npm"]

CMD ["run", "start"]
