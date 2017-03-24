'use strict';

const TCPClient = require('./TCPClient.js');
var ansi = require('ansi')
  , cursor = ansi(process.stdout)

module.exports = class RequestHandler {
    constructor() {
        this.connected = false;
        this.possibleRequests = ['msg', 'connect', 'login', 'logout', 'exit', 'help', 'names'];
        this.log('Connect with:\r\nconnect host port\r\ne.g. "connect localhost 3000"');
    }

    parse(input) {
        const self = this;

        // check if answer is blank
        if(input.length == 0) {
            return;
        }

        const args = input.split(' ');

        if(args[0] in this.possibleRequests){
            this.log('Error: command not possible')
            return
        }

        if (args[0] == "connect") {
            if (this.connected == false){
                this.client = new TCPClient(args[1], args[2]);
                this.client.on("log", this.log);
                this.client.on("response", (res) => self.printResponse(res));
                this.connected = true;
            } else {
                this.log("Already connected. Please disconnect before attempting to connect.");
            }
        }
        else if (args[0] == "login") {
            this.client.login(args[1]);
        }
        else if (args[0] == "msg") {
            this.client.sendMsg(input.substring(4,input.length));
        }
        else if (args[0] == "history") {
            this.client.getHistory();
        }
        else if (args[0] == "names") {
            this.client.getNames();
        }
        else if (args[0] == "help") {
            this.client.help();
        }
        else {
            this.log("Invalid command");
        }
    }

    log(msg, type) {
        //Push one up
        cursor.goto(process.stdout.getWindowSize()[0],process.stdout.getWindowSize()[1]-1);
        cursor.write('\n');
        if (type != "direct") {
            cursor.write('\n');
        }
        //Print to line 2 from bottom
        cursor.goto(0,process.stdout.getWindowSize()[1]-1);

        cursor.eraseLine();
        cursor.write(msg);
        cursor.goto(0,process.stdout.getWindowSize()[1]);
        cursor.write("> ");
        //Return to input
    }

    printResponse(response) {
        if (response.response == "msg") {
            this.log("-> [" + ('\x1b[' + '33' + 'm') + response.sender + ('\x1b[' + '37' + 'm') + "] " + response.content, "msg");
        }
        else if (response.response == "history") {
            for (var i = 0; i < response.content.length; i++) {
                this.printResponse(JSON.parse(response.content[i]));
            }
        }
        else if (response.response == "info" || response.response == "names") {
            this.log("-> [" + ('\x1b[' + '35' + 'm') + "Server" + ('\x1b[' + '37' + 'm') + "] " + response.content, "direct");
        } 
        else {
            console.log("Unknown command");
            console.log(response.response);
        }
        //this.log("-> Response");
    }
}
