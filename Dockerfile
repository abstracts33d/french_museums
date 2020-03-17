FROM node:9.11.1-alpine

# set working directory
RUN mkdir app
WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .
RUN yarn run build

EXPOSE $PORT