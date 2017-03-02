const net = require('net');

const port = 3000;

const server = net.createServer((socket) => {
    socket.setEncoding("utf8");
    socket.on('data', handleData);
}).on('error', (err) => {
    //Handle errors
});

server.listen({
    host: 'localhost',
    port: port
}, () => {
    console.log("Listening on port " + port);
});

function handleData(data) {
    console.log(data);
}