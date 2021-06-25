FROM node:12-alpine
WORKDIR /opt/app
RUN apk update && apk upgrade
RUN apk add --no-cache git
COPY package*.json ./
# ENV NODE_ENV production
RUN yarn install
COPY . .
RUN yarn compile
CMD yarn start
