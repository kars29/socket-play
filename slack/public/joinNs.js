let nsSocket;

function joinNs(endpoint) {

    if(nsSocket) {
        console.log('closing exisitng socket');
        nsSocket.emit('leaveRoom', true);
        nsSocket.close();
    }
    nsSocket = io(`http://localhost:9000${endpoint}`);

    nsSocket.on('loadRooms', rooms => {
        const roomsDiv = document.querySelector('.room-list');
        roomsDiv.innerHTML = '';
        rooms.forEach((room, roomIndx) => {
            roomsDiv.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe'} "></span>${room.roomTitle}</li>`;
            
        });
        // add click listener to each room
        console.log("On load rooms")
        let roomName = '';

        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem)=>{
            console.log("Adding event listener to room ", elem)
            elem.addEventListener('click',(e)=>{
                // console.log("Somone clicked on ",e.target.innerText);
                joinRoom(nsSocket, e.target.innerText)
                roomName = e.target.innerText;
            })
        })

        const topRoom = rooms[0].roomTitle;
        console.log(topRoom)
        joinRoom(nsSocket, topRoom);
        roomName = topRoom;


        nsSocket.on(`messageToClient`, (message) => {
            console.log(message)
            const builtHtml = buildHTML(message);
            document.querySelector('#messages').innerHTML += builtHtml;
        });


        let formDiv = document.querySelector('.message-form');
        let newFormDiv = formDiv.cloneNode(true)
        formDiv.replaceWith(newFormDiv);
        newFormDiv.addEventListener('submit', (e)=>{
            
            formSubmission(e, nsSocket, roomName)
        });

        nsSocket.on('historyCatchup', history => {
            const builtHtml = history.map(buildHTML).reduce((a, b) => a+b, '');
            const messageUI = document.querySelector('#messages');
            messageUI.innerHTML = builtHtml;
            console.log('history catchup')
            messageUI.scrollTo(0, messageUI.scrollHeight);
        });

        nsSocket.on('userCount', usercount => {
            const numUsersDiv = document.querySelector('.curr-room-num-users');
            numUsersDiv.innerHTML = ` Users ${usercount} <span class="glyphicon glyphicon-user"></span></span></div>`;
            console.log('usercount')
            document.querySelector('.curr-room-text').innerText = roomName;
        })

        
        
    });

    

}



function formSubmission(event, nsSocket, room){
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    console.log(`submitting ${room}`)
    nsSocket.emit('newMessageToServer',{text: newMessage, room})
}

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>    
    `
    return newHTML;
}

