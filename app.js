'use strict';

const http = require('http');
const app = http.createServer((req, res) => {
  res.writeHead(200);
  res.write('<h1>Cloud Provider: ' + (process.env.CLOUD || 'Not Set') + '</h1>');
  res.write('<h1>Hello from Hachathon 2020-09-25</h1>');
  res.end('<h1>Version: V2</h1>');
});
app.listen(process.env.PORT || 80);

module.exports = app;
