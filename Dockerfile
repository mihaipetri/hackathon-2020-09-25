FROM node:12

WORKDIR /usr/src/app

COPY . .

EXPOSE 80

CMD [ "node", "app.js" ]
