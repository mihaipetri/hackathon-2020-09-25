'use strict';

const http = require('http');
const app = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello Hachathon 2020-09-25 ! V1');
});
app.listen(process.env.PORT || 80);

module.exports = app;
