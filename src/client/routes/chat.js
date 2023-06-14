const path = require('path');

module.exports = {
    path: 'chat',
    type: 'GET',
    call: (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../public/chat.html'));
    }
}