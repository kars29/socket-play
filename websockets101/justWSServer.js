const http = require('http');

const websocket = require('ws');

const server = http.createServer((req, res) => {
    return res.end("Connected!")

});

const wss = new websocket.Server({server});

wss.on('headers', (headers, req) => {
    console.log("Emitted before the response headers are written to the socket as part of the handshake.");
    console.log(headers)
});

wss.on('connection', (soc, req) => {
    console.log("After handshake", req);
    soc.send("welcome to sockets!");
    soc.onmessage = (event) => {
        console.log("msg from client: ", event.data);
    }
});


server.listen(8000);