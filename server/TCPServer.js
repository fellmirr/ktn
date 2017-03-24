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

        /* Class storage */
        this.clients = {};
        this.history = [];

        const self = this;

        //Create server
        const server = net.createServer((socket) => {
            socket.id = shortid.generate();

            let client = new ClientHandler(socket, self);
            this.clients[socket.id] = client;
        }).on('error', (err) => {
            //Handle errors
        });

        server.listen({
            host: 'localhost',
            port: port
        }, () => {
            self.log("Listening on port " + port, "status");
        });
    }

    broadcast(msg, senderID) {
        this.log('Broadcasting: "' + msg + '" From: ' + senderID);

        var senderUsername = this.clients[senderID].username;
        var timestamp = + new Date();

        this.history.push(JSON.stringify({
            timestamp: timestamp,
            sender: senderUsername,
            response: "msg",
            content: msg
        }));

        for (let clientID in this.clients) { //For each property in object.
            if (clientID != senderID) {
                let client = this.clients[clientID];
                client.write("msg", msg, senderUsername);
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
        var names = [];
        for (let clientID in this.clients) {
            names.push(this.clients[clientID].username);
        }
        return names;
    }

    getHistory() {
        return this.history;
    }

    getHelp() {
        return "Valid commands are: Login, names, history, msg and help";
    }

    logout(clientID) {
        this.clients[clientID].destroy();
        removeClient(clientID);
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