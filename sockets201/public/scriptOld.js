const socket = io('http://localhost:9000'); // the / namespace/endpoint
const adminSocket = io('http://localhost:9000/admin')

console.log(socket.io)

socket.on('connect',()=>{
    console.log(socket.id)
})

adminSocket.on('connect',()=>{
    console.log('admin   '+adminSocket.id)
})

adminSocket.on('messageFromServer', data => {
    console.log("Got mesg for admin :"+ data)
})

socket.on('messageFromServer',(dataFromServer)=>{
    console.log(dataFromServer);
    socket.emit('dataToServer',{data: "Data from the Client!"})
})

document.querySelector('#message-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer',{text: newMessage})
})

socket.on('messageToClient',(msg)=>{
    console.log(msg)
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
})

// socket.on('ping',()=>{
//     console.log('Ping was recieved from the server.');
//     console.log(io.protocol)
// })

// socket.on('pong',(latency)=>{
//     console.log(latency);
//     console.log("Pong was sent to the server.")
// })