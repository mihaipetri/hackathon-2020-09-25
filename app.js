'use strict';

const http = require('http');
const app = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello Kubernetes! V1');
});
app.listen(process.env.PORT || 8080);

module.exports = app;
