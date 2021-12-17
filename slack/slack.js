const express = require('express');
const app = express();

const namespaces = require('./data/namespace');

const socketio = require('socket.io');

app.use(express.static(__dirname+'/public'));

const expressserver = app.listen(9000);
const io = socketio(expressserver);

io.on('connection', (socket) => {
    const nsData = namespaces.map(ns => (
        {
            img: ns.img,
            endpoint: ns.endpoint
        }
    ));
    console.log(nsData)
    socket.emit('nsList', nsData);
})

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', socket => {
        console.log( `${socket.id} joined`)
        socket.emit('loadRooms', namespace.rooms);

        socket.on('joinRoom',  (roomToJoin, numberOfUsers) => {
            console.log('Room to join is', roomToJoin)
            leaveRoom(namespace, socket);
            socket.join(roomToJoin);
            updateMemebers(namespace, roomToJoin);
            console.log(namespace.rooms)
            const nsRoom = namespace.rooms.find( r => r.roomTitle === roomToJoin);


            try{
            socket.emit('historyCatchup', nsRoom.history);
            } catch(err){
                console.log(err)
            }
            
        });

        socket.on('leaveRoom', e => {
            leaveRoom(namespace, socket)
        })

        socket.on('newMessageToServer', (msg) => {
            console.log(msg)
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: 'kars',
                avatar: 'https://via.placeholder.com/30'
            }

            console.log(socket.rooms)
             // the user will be in the 2nd room in the object list
            // this is because the socket ALWAYS joins its own room on connection
            // const room = Object.keys(socket.rooms)[1];
            const room = msg.room;

            console.log(`current room ${room}`)
            const nsRoom = namespace.rooms.find( r => r.roomTitle === room);
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(room).emit('messageToClient', fullMsg);

        })
    })
})


function leaveRoom(namespace, socket) {
    const roomToleave = Object.keys(socket.rooms)[1];
    socket.leave(roomToleave);
    updateMemebers(namespace, roomToleave)
}
function updateMemebers(namespace, room) {
    io.of(namespace.endpoint).in(room).clients((error, clients) => {

        console.log(clients)
        // numberOfUsers(Array.from(clients).length);
        io.of(namespace.endpoint).to(room).emit('userCount', clients.length)
    });
}