const net = require('net');
const shortid = require('shortid');

var ansi = require('ansi')
  , cursor = ansi(process.stdout)

const ClientHandler = require('./ClientHandler.js');

class TCPServer {
    constructor(port) {
        cursor.magenta().write("\n====== TCP Chat server ====== \n\n");
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
            _that.log("Listening on port " + port, "status");
        });
    }

    broadcast(msg, senderID) {
        this.log('Broadcasting: "' + msg + '" From: ' + senderID);

        for (let clientID in this.clients) { //For each property in object. Not the same as python for ... in
            if (clientID != senderID) {
                let client = this.clients[clientID];
                client.write("msg", msg, this.clients[senderID].username);
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

    /* Log code */
    log(msg, type) {
        if (!type) type = "info";

        var time = new Date();
        cursor.grey();
        cursor.write(time.timeNow());
        cursor.reset();

        if (type == "info") {
            cursor.write(" -> ");
        } else if (type == "error") {
            cursor.red();
            cursor.write(" !> ");
            cursor.reset();
        } else if (type == "add") {
            cursor.green();
            cursor.write(" +> ");
            cursor.reset();
        } else if (type == "status") {
            cursor.magenta();
            cursor.write(" => ");
            cursor.reset();
        }

        cursor.write(msg);
        cursor.write("\n");
    }
}

cursor.write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join('')).eraseData(2).goto(1, 1);
const SERVER = new TCPServer(3000);

function lf () { return '\n' }

Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}