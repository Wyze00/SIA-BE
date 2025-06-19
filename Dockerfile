FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .
COPY .env.docker /app/.env

RUN npm run build

CMD ['npm', 'run', 'start']