const net = require('net');
const EventEmitter = require('events').EventEmitter;

var ansi = require('ansi')
  , cursor = ansi(process.stdout)

module.exports = class TCPClient extends EventEmitter {
    constructor(host, port) {
        super(host, port);
        this.client = net.connect({
            host: host,
            port: port
        }, () => {
            this.emit("log", "Connected to server. Host: " + host + " Port: " + port);
            this.client.on('data', (data) =>  this.incomming(data));
        });
    }

    login(username) {
        this.sendToServer("login", username);
        this.username = username;
    }

    sendMsg(msg) {
        cursor.goto(0,process.stdout.getWindowSize()[1]-1);
        cursor.write("-> [" + ('\x1b[' + '33' + 'm') + this.username + ('\x1b[' + '37' + 'm') + "] " + msg + "\n");

        this.sendToServer("msg", msg);
    }

    getNames() {
        this.sendToServer("names");
    }

    help() {
        this.sendToServer("help");
    }

    getHistory() {
        this.sendToServer("history");
    }

    logout() {
        this.sendToServer("logout");
    }

    sendToServer(request, content) {
        if (!content) content = null;

        this.client.write(JSON.stringify({
            request: request,
            content: content
        }));
    }

    incomming(data) {
        try {
            var data = JSON.parse(data);
            this.emit("response", data);
        } catch (ex) {
            this.emit("log", "!> Malformed incomming data");
            //console.log(ex);
        }
    }
}