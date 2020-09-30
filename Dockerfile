FROM node:12

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]
