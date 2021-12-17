const express = require('express');
const app = express();


const socketio = require('socket.io');

app.use(express.static(__dirname+'/public'));

const expressserver = app.listen(9000);
const io = socketio(expressserver);

io.on('connection', (socket) => {
    socket.emit('messageFromServer', {data: 'Welcome to sockets'});
    socket.on('messageToServer', dataFromClient => {
        console.log(dataFromClient);

    });
    socket.on('newMessageToServer', msg => {
        io.emit('messageToClient', { text: msg.text})
    })
})

io.of('/admin').on('connect', socket => {
    console.log('someone connected')
    socket.emit('messageFromServer', "hello admins")
})