function joinRoom(nsSocket, roomName) {
    nsSocket.emit('joinRoom', roomName, (numberOfUsers) => {
        const numUsersDiv = document.querySelector('.curr-room-num-users');
        console.log("joined room ", roomName)
        numUsersDiv.innerHTML= ` Users ${numberOfUsers} <span class="glyphicon glyphicon-user"></span></span></div>`
    });



}
