const socket = io('http://localhost:9000'); // the / namespace/endpoint

console.log(socket.io)

socket.on('connect', () => {
    console.log(socket.id)
});

let nsRoomMap;
socket.on('nsList', nsData => {
    console.log(nsData);
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    nsRoomMap = {};

    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += ` <div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>
        `;
        
    });

    const namespaceDiv = document.getElementsByClassName('namespace'); // HtmlCollection - arraylike

    Array.from(namespaceDiv).forEach(ns => {
        ns.addEventListener('click', e => {
            console.log(ns.getAttribute('ns'))
            const nsEndpoint = ns.getAttribute('ns');
            joinNs(nsEndpoint);
        })
    });

    joinNs(nsData[0].endpoint);

})