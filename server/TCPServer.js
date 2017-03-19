const net = require('net');
const shortid = require('shortid');

var ansi = require('ansi')
  , cursor = ansi(process.stdout)

const ClientHandler = require('./ClientHandler.js');

class TCPServer {
    constructor(port) {
        cursor.magenta().write("TCP Chat server \n");
        cursor.reset();

        require('child_process').exec('git rev-parse HEAD', function(err, stdout) {
            cursor.grey();
            console.log('Last commit hash on this branch is:', stdout);
            cursor.reset();
        });

        this.clients = {};

        const _that = this;

        const server = net.createServer((socket) => {
            socket.id = shortid.generate();

            let client = new ClientHandler(socket, _that);
            this.clients[socket.id] = client;
        }).on('error', (err) => {
            //Handle errors
        });

        server.listen({
            host: 'localhost',
            port: port
        }, () => {
            console.log("Listening on port " + port);
        });
    }

    broadcast(msg, senderID) {
        for (let clientID in this.clients) { //For each property in object. Not the same as python for ... in
            if (clientID != senderID) {
                let client = this.clients[clientID];
                client.write("msg", msg, client.username);
            }
        }
    }

    usernameExists(username) {
        for (let clientID in this.clients) {
            if (this.clients[clientID].username == username) return true;
        }
        return false;
    }

    getNames() {
        
    }

    getHistory() {

    }

    logout(clientID) {

    }

    /* Cleanup code */
    removeClient(id) {
        delete this.clients[id];
    }
}

cursor.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join('')).eraseData(2).goto(1, 1);
const SERVER = new TCPServer(3000);

function lf () { return '\n' }