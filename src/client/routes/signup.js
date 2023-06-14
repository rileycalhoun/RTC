module.exports = {
    path: 'signup',
    aliases: ['register'],
    type: 'GET',
    call: (req, res) => {
        res.send("Hello, world!");
    }
}