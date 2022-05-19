FROM node:16-alpine

WORKDIR /app

RUN apk --no-cache add --virtual builds-deps build-base python3

COPY package.json .
COPY yarn.lock .
COPY nest-cli.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

RUN yarn install