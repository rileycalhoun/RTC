module.exports = {

    generateId: () => {
        return Math.round((Math.random() * Date.now()) / (Math.random() * 10001));
    }

}