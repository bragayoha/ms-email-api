FROM node:16.15.1

WORKDIR /user/app

COPY package*.json ./

RUN npm i && npm i argon2

COPY . .

EXPOSE 3333

CMD ["node","ace","serve","--watch"]
