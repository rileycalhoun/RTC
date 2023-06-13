var userProperties = {};
var id = undefined;
var username = undefined;

var socket = io();

var connectionStatus = document.getElementById('status');

var messages = document.getElementById('messages');
var messageForm = document.getElementById('messageForm');
var messageInput = document.getElementById('messageInput');

var usernameForm = document.getElementById('usernameForm');
var usernameInput = document.getElementById('usernameInput');

var users = document.getElementById('users');

// Detect when the 'Send' button or the 'Enter' key is pressed
messageForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Check the input is not empty
    if (messageInput.value) {
        // Emit a chat message through the socket
        // and set the input field to blank
        socket.emit('chat', messageInput.value);
        messageInput.value = '';
    }
});

usernameForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Check the input is not empty
    if (usernameInput.value) {
        // Emit a username update through the socket
        // and set the input field to blank
        socket.emit('updateUsername', usernameInput.value);
        username = usernameInput.value;
        usernameInput.value = '';
    }
});

// Detect when the server updates the client's id
socket.on('updateId', function(newId) {
    id = newId;
    connectionStatus.textContent = 'Connected as ' + id;
    console.info('Connected as ' + id);
});


var userElements = {};
// Detect when the server sends over an updated users list
socket.on('updateUsers', function(newUserProperties) {
    console.info('Updated users list: ' + JSON.stringify(newUserProperties));
    userProperties = newUserProperties;

    // Always remove existing elements for users
    for(var user in userElements) {
        if(users.contains(userElements[user])) {
            users.removeChild(userElements[user]);
        }
    }

    var newUserElements = {};
    for(var userId in userProperties) {
        const userItem = document.createElement('li');
        userItem.textContent = userProperties[userId].username || userId;
        newUserElements[userId] = userItem;
        users.appendChild(userItem);
    }

    userElements = newUserElements;
});

// Detect when a chat message is received
socket.on('chat', function(msg, displayName) {
    var item = document.createElement('li'); // Create a new list item
    if(id == displayName || username == displayName) {
        displayName = "You";
    }

    item.textContent = displayName + ": " + msg; // Set the text of the list item to the message
    messages.appendChild(item); // Add the item to the list of messages
    window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom of the page
    if(displayName != "You") {
        console.log(`Received message from ${displayName}: ${msg}`)
    } else {
        console.log("Sent message to server: " + msg)
    }
});