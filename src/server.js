// Get schema, url and port
const { schema, url, port } = require('../configs/config.json');

// Define the express app
const express = require('express');
const app = express();
app.use(express.static(__dirname, {
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

// Serve the index.html file to the client
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Define a user list and a socket map
userProperties = {};

io.on('connection', (socket) => {

    // Generate a new UUID for the user 
    let id = Date.now().toString().slice(-10);
    userProperties[id] = {
        id: id,
        username: undefined
    }

    // Log the connection, send the id and users list to the client
    console.info('User with id ' + id + ' connected');

    // Update the user list
    io.emit('updateUsers', userProperties);

    // Update the user's id on their end
    socket.emit('updateUser', userProperties[id]);

    // Detect when a user disconnects
    socket.on('disconnect', () => {
      // Remove from the usernames map and the userlist
      delete userProperties[id];

      // Update the user list
      io.emit('updateUsers', userProperties);

      // Log the disconnection
      console.info('User with id ' + id + ' disconnected');
    });

    // Detect when a chat message is sent
    socket.on('chat', (msg) => {
        // Define the display name as the username if it exists, otherwise use the id
        const displayName = userProperties[id].username || id;

        // Log the message to the server console
        console.log(displayName + ': ' + msg);

        // Emit the message to all clients
        io.emit('chat', msg, displayName);
    });

    // Detect when a username update is sent
    socket.on('updateUsername', (newUsername) => {
        console.info(id + ' changed their username to ' + newUsername);
        
        // Set the username in the userProperties map
        userProperties[id].username = newUsername;

        // Emit the updated user list
        io.emit('updateUsers', userProperties);

        // Update the username on the client's end
        socket.emit('updateUser', userProperties[id]);
    });
});

webServer.listen(port, () => {
  if(!url.includes(':')) {
      url = url + ':' + port;
  }


  console.info(`Listening on port ${port}`);
  console.log(`Access on ${schema}://${url}`);
});