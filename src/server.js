// Define the express app
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public', {
    index: false,
    immutable: false,
    cacheControl: true,
    maxAge: "30d"
}));

// Define the web server
const http = require('http');
const webServer = http.createServer(app);

// Define the socket server
const { Server } = require("socket.io");
const io = new Server(webServer);

// Send the index.html file to the client
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

socketMap = {};
io.on('connection', (socket) => {

    // Generate a new UUID
    let id = Date.now().toString().slice(-10);
    socketMap[id] = socket;

    // Insert generated ID into socket list, log the connection
    // and then send the ID to the client
    socketMap[id] = socket;
    console.log('User with id ' + id + ' connected');
    socket.emit('updateId', id);

    // Detect when a user disconnects
    socket.on('disconnect', () => {
      console.log('User with id ' + id + ' disconnected');
      delete socketMap[id];
    });

    // Detect when a chat message is sent
    socket.on('chat', (msg) => {
        console.log(id + ': ' + msg);
        io.emit('chat', msg, id);
    });
});

webServer.listen(3000, () => {
  console.log('listening on *:3000');
});