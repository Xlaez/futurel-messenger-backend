const express = require('express');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const { port, listen } = require('./config/config');
const io = require('socket.io')

const { Mongo } = require('./config/database');
const { header } = require('./middlewares/headers');
const { fileFilter, fileStorage } = require('./config/multer');
const { authRouter } = require('./routes/auth.routes');
const { chatRouter } = require('./routes/chat.routes');

const server = express();
var corsOption = {
    origin: "*"
};
server.use(header)
server.use(cors(corsOption));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

server.use('/assets', express.static(path.join(__dirname, "assets")));

server.use('/api/auth', authRouter);
server.use('/api/chat', chatRouter)

Mongo.then(

    result => {
        console.log("======> Mongo connected");
    }
).catch(err => {

    return console.log(`======> ${err}`)
});

const connection = server.listen(port, () => {
    console.log('======> server running at', port)
});

//SOCKET INITIALIZATION
const socket = io(connection, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    }
})

global.onlineUsers = new Map();

socket.on("connection", (socket) => {

    global.chatSocket = socket;

    socket.on("add-user", (userId) => {

        onlineUsers.set(userId, socket.id);

        if (onlineUsers.get(userId)) {

            socket.emit('active', userId);
        }
    })
    // console.log(onlineUsers);
    socket.on("send-msg", (data) => {

        const sendUserSocket = onlineUsers.get(data.to);

        if (sendUserSocket) {

            socket.to(sendUserSocket).emit("receive-msg", data.messages);
        }
    })
})
