FROM node:20.12.2-alpine3.18

WORKDIR /app

COPY package*.json .

RUN npm install

RUN mv node_modules /node_modules

COPY . .

ENV NODE_ENV=production

RUN npm run build

RUN chmod +x ./entrypoint.sh

EXPOSE 4173 5173

ENTRYPOINT ["./entrypoint.sh"]
