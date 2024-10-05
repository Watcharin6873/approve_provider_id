FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 5004

CMD [ "serve", "-s", "dist" ]