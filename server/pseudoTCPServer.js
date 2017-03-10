class TCPServer {
    constructor() {
        this.clients = {};

        /*
        {
            "admin": ClientHandler instance,
            "quintin": ClientHandler instance
        }
        */
        const server = net.createServer((socket) => {
            let client = new ClientHandler(socket, server);
            this.clients[socket.id] = client;
        }).on('error', (err) => {
            //Handle errors
        });
    }

    broadcast(msg, senderID) {

    }

    usernameExists(username) {
        //loop over clients
    }

    getNames() {
        
    }

    getHistory() {

    }

    logout(clientID) {

    }
}