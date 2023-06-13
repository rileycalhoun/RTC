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

// Define a user list and a socket map
userProperties = {};
openConnections = {};

io.on('connection', (socket) => {

    // Generate a new UUID for the user and add them to the list
    // Add the id to the id list and the socket to the socket map
    let id = Date.now().toString().slice(-10);
    openConnections[id] = socket;
    userProperties[id] = {
        username: undefined
    }

    // Log the connection, send the id and users list to the client
    console.log('User with id ' + id + ' connected');
    // Emit updates to clients
    socket.emit('updateId', id);
    io.emit('updateUsers', userProperties);

    // Detect when a user disconnects
    socket.on('disconnect', () => {
      console.log('User with id ' + id + ' disconnected');
      delete openConnections[id];
      
      // Remove from the usernames map and the userlist
      delete userProperties[id];
      io.emit('updateUsers', userProperties);
    });

    // Detect when a chat message is sent
    socket.on('chat', (msg) => {
        const displayName = userProperties[id].username || id;
        console.log(displayName + ': ' + msg);
        io.emit('chat', msg, displayName);
    });

    // Detect when a username update is sent
    socket.on('updateUsername', (newUsername) => {
        console.log(id + ' changed their username to ' + newUsername);
        
        // Set the username in the userProperties map
        userProperties[id].username = newUsername;
        io.emit('updateUsers', userProperties);
    });
});

webServer.listen(3000, () => {
  console.log('listening on *:3000');
});