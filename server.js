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
<<<<<<< HEAD
app.io.attach(server);
//----socket io----//

// let messages = []

// var io = require('socket.io')(server);

// io.on('connection', socket => {
//     console.log(`Socket conectado: ${socket.id}`);

//     socket.on('user-connected', user => {
//         socket.user = user;
//         socket.broadcast.emit("users-changed", {user: user, event:"connected"});
//     });

//     socket.on("message", data => {
//         io.emit("message", data);
//     });

//     socket.on("disconnect", () => {
//         io.emit("users-changed", { user: socket.user, event: "disconnected" });
//     });

//     socket.on('sendMessage', data => {
//         console.log(data);
//         messages.push(data);
//     });   


// }) 

//-----------//

=======
>>>>>>> fbe9456689e9e11b5a2ce02712a02b75a8edf8bd
console.log('serve rodando');
server.listen(port);