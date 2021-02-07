FROM ubuntu:18.04
ARG port

RUN apt update && apt install -yq curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs

RUN mkdir /newsmonitoring-app
COPY . /newsmonitoring-app
WORKDIR /newsmonitoring-app

RUN npm install --only=prod

ENV NODE_ENV production
ENV PORT ${port}

EXPOSE ${port}

CMD ["npm", "start"]
