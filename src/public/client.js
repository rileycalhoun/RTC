let id = undefined;

var socket = io();

var connectionStatus = document.getElementById('status');
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

// Detect when the 'Send' button or the 'Enter' key is pressed
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Check the input is not empty
    if (input.value) {
        // Emit a chat message through the socket
        // and set the input field to blank
        socket.emit('chat', input.value);
        input.value = '';
    }
});

socket.on('updateId', function(newId) {
    id = newId;
    connectionStatus.textContent = 'Connected as ' + id;
    console.info('Connected as ' + id);
});

// Detect when a chat message is received
socket.on('chat', function(msg, userId) {
    var item = document.createElement('li'); // Create a new list item
    if(id == userId) {
        userId = "You";
    }

    item.textContent = userId + ": " + msg; // Set the text of the list item to the message
    messages.appendChild(item); // Add the item to the list of messages
    window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom of the page
    if(userId != "You") {
        console.log(`Received message from ${userId}: ${msg}`)
    } else {
        console.log("Sent message to server: " + msg)
    }
});