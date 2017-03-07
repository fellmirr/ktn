const net = require('net');

const port = 3000;

users = {};

const server = net.createServer((socket) => {
    socket.setEncoding("utf8");
    socket.on('data', (data) => {handleData(socket.id, data)});
}).on('error', (err) => {
    //Handle errors
});

server.listen({
    host: 'localhost',
    port: port
}, () => {
    console.log("Listening on port " + port);
});

function handleData(clientid, data) {
    console.log(data);
    var data = JSON.parse(data);

    if (data.command == "login") {
        users[clientid] = data.content;

        console.log(users);
    }
}