### Stage 1: Build ###
FROM node:lts-alpine as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install @vue/cli@4.5.7 -g
COPY . /usr/src/app

### Stage 2: Run ###
EXPOSE 8080
CMD ["npm", "run", "serve"]