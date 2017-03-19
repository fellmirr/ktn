const net = require('net');

module.exports = class TCPClient {
    constructor(host, port) {
        this.client = net.connect({
            host: host,
            port: port
        }, () => {
            console.log("Connected to server. Host: " + host + " Port: " + port);
            this.client.on('data', this.incomming);
        });
    }

    login(username) {
        this.sendToServer("login", username);
    }

    sendMsg(msg) {
        this.sendToServer("msg", msg);
    }

    names() {
        this.sendToServer("names", null);
    }

    help() {
        this.sendToServer("help", null);
    }

    logout() {
        this.sendToServer("logout", null);
    }

    sendToServer(request, content) {
        this.client.write(JSON.stringify({
            request: request,
            content: content
        }));
    }

    incomming(data) {
        try {
            var data = JSON.parse(data.toString('utf8'));
            console.log(JSON.stringify(data));
        } catch (ex) {
            console.log("!> Malformed incomming data");
        }
    }
}