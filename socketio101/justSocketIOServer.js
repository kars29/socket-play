const http = require('http');

const socketio = require('socket.io');

const server = http.createServer((req, res) => {
    return res.end("Connected!")

});

const io = socketio(server, {
    cors: {
      origin: '*',
    },
  });

// io.on('headers', (headers, req) => {
//     console.log("Emitted before the response headers are written to the socket as part of the handshake.");
//     console.log(headers)
// });

io.on('connection', (soc, req) => {
    console.log("After handshake", req);
    soc.emit("welcome", "welcome to sockets!");
    soc.on("ackWelcome",(event) => {
        console.log("msg from client: ", event);
    });
});


server.listen(8000);