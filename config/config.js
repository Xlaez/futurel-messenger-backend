require('dotenv').config();
const secret = process.env.TOKEN_SECRET;

module.exports = {
    port: process.env.PORT || 8081,
    listen: function (server) {
        server.listen(this.port);
    },
    collection: 'futuremessenger',
    secret: secret,
}