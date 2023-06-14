var userProperties = {};

var id = undefined;
var username = undefined;

var socket = io("http://localhost:3000");

var connectionStatus = document.getElementById('status');

var messages = document.getElementById('messages');
var messageForm = document.getElementById('messageForm');
var messageInput = document.getElementById('messageInput');

var usernameForm = document.getElementById('usernameForm');
var usernameInput = document.getElementById('usernameInput');

var users = document.getElementById('users');

// Detect when the 'Send' button or the 'Enter' key is pressed
messageForm.addEventListener('submit', function(e) {
    // Prevent the page from reloading
    e.preventDefault();

    // Check the input is not empty
    if (messageInput.value) {
        // Emit a chat message through the socket
        socket.emit('chat', messageInput.value);

        // Clear the input field
        messageInput.value = '';
    }
});

// Detect when the 'Change Username' button or the 'Enter' key is pressed
usernameForm.addEventListener('submit', function(e) {
    // Prevent the page from reloading
    e.preventDefault();

    // Check the input is not empty
    if (usernameInput.value) {
        // Emit a username update through the socket
        socket.emit('updateUsername', usernameInput.value);

        // Update the client's username
        username = usernameInput.value;

        // Clear the input field
        usernameInput.value = '';
    }
});

// Detect when the server updates the client's id
socket.on('updateUser', function(data) {
    // Update the client's id
    id = data.id;
    username = data.username;

    // Update the connection status
    let displayName = username || id;
    connectionStatus.textContent = 'Connected as ' + displayName;

    // Log the connection
    console.info('Connected as ' + id);
});


var userElements = {};
// Detect when the server sends over an updated users list
socket.on('updateUsers', function(newUserProperties) {
    // Log the updated users list
    console.info('Updated users list: ' + JSON.stringify(newUserProperties));

    // Update the users list
    userProperties = newUserProperties;

    // Always remove existing elements for users
    for(var user in userElements) {
        // Check if the user is still in the list
        if(users.contains(userElements[user])) {
            // Remove the user from the list if they are
            users.removeChild(userElements[user]);
        }
    }

    // Add new elements for users
    var newUserElements = {};
    // Iterate over the new users list
    for(var userId in userProperties) {
        // Create a new list item for the user
        const userItem = document.createElement('li');

        // Set the text of the list item to the username if it exists, otherwise use the id
        userItem.textContent = userProperties[userId].username || userId;

        // Add the user to the list
        newUserElements[userId] = userItem;

        // Add the user to the list of users
        users.appendChild(userItem);
    }

    // Update the user elements
    userElements = newUserElements;
});

// Detect when a chat message is received
socket.on('chat', function(msg, displayName) {
    // Create a new list item
    var item = document.createElement('li');

    // Set the display name to "You" if the message is from the client
    if(id == displayName || username == displayName) {
        displayName = "You";
    }

    // Set the text of the list item to the message
    item.textContent = displayName + ": " + msg;

    // Add the item to the list of messages
    messages.appendChild(item);

    // Scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);

    // Log the message to the client console
    if(displayName != "You") {
        console.log(`Received message from ${displayName}: ${msg}`)
    } else {
        console.log("Sent message to server: " + msg)
    }
});