// const http = require('http');
// const app = require('./app');
// require('dotenv').config()

// const port = process.env.PORT || 3000;
// const server = http.createServer(app);
// server.listen(port);

// const http = require('http');
// const app = require('./app');
// require('dotenv').config()

// const port = process.env.PORT || 3000;
// const server = http.createServer(app);
// console.log('serve rodando');
// server.listen(port);

const http = require('http');
const app = require('./app');
require('dotenv').config()

const port = process.env.PORT || 3000;
const server = http.createServer(app);
console.log('serve rodando');
server.listen(process.env.PORT || 5000);