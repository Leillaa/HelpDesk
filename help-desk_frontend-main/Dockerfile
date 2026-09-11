#FROM node:18-alpine
#
#WORKDIR /client
#
#COPY package*.json ./
#
#RUN npm install
#
#COPY . .
#
#EXPOSE 3000
#
#CMD ["npm", "start"]

FROM node:13.12.0-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

CMD cp -r build result_build
