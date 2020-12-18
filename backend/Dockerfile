### Stage 1: Build ###
FROM node:lts-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . /usr/src/app

### Stage 2: Run ###
EXPOSE 3000
CMD [ "node", "main.js" ]