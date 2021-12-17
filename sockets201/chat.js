const express = require('express');
const app = express();


const socketio = require('socket.io');

app.use(express.static(__dirname+'/public'));

const expressserver = app.listen(9000);
const io = socketio(expressserver);

io.on('connection', (socket) => { // default namespace /
    socket.emit('messageFromServer', {data: 'Welcome to sockets'+' your id is '+socket.id});
    socket.on('messageToServer', dataFromClient => {
        console.log(dataFromClient);

    });
    
    socket.join('level1', s => console.log(s)); // add user to a room
    socket.to('level1').emit('joined', `${socket.id} says I joined room `)
})

io.of('/admin').on('connect', socket => { // namespace /admin
    console.log('someone connected')
    socket.emit('messageFromServer', "hello admins")
})