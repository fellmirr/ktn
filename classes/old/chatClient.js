'use strict';

const net = require('net');

module.exports = class ChatClient {
    constructor(host, port, username, options) {
        this.client = net.connect({
            host: host,
            port: port
        }, () => {
            console.log("Connected to server. Host: " + host + " Port: " + port);
            this.login(username);
            this.client.on('data', this.incomming);
        });

        if(options.debug) {
            this.debug = true;
        }
        else {
            this.debug = false;
        }
    }

    login(username) {
        this.client.write(JSON.stringify({
            request: "login",
            content: username
        }));
    }

    logout() {
        this.client.write(JSON.stringify({
            request: "logout",
            content: null
        }));
    }

    incomming(data) {
        var data = JSON.parse(data);

        if (this.debug) {
            console.log(JSON.stringify(data));
        }

        if (data.response) {
            
        }
    }
}