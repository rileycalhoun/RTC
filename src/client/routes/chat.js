module.exports = {
    path: 'chat',
    type: 'GET',
    call: (req, res) => {
        res.sendFile(__dirname + '/../public/chat.html');
    }
}