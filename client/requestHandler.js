'use strict'

const TCPClient = require('./TCPClient.js');

class RequestHandler {
    constructor() {
        this.connected = false;
        this.possibleRequests = ['msg', 'connect', 'login', 'logout', 'exit', 'help', 'names'];
        console.log('Connect with:\r\nconnect host port\r\ne.g. "connect localhost 3000"');
    
    }

    parse(input) {
        // check if answer is blank
        if(input.length == 0) {
            return;
        }

        const args = input.split(' ');

        if(args[0] in this.possibleRequests){
            console.log('Error: command not possible')
            return
        }

        if (args[0] == "connect") {
            if (this.connected == false){
                this.client = new TCPClient(args[1], args[2]);
                this.connected = true;
            } else {
                console.log("Already connected. Please disconnect before attempting to connect.");
            }
        }
        else if (args[0] == "login") {
            this.client.login(args[1]);
        }
        else if (args[0] == "msg") {
            this.client.sendMsg(args[1]);
        }
        else {
            console.log("Invalid command");
        }
    }

    printResponse(response) {
        if (response.response == "history") {

        }
        //Print response in some format
    }
}

var p = new RequestHandler;
function readRequest(){
    // Reads input, runs continually
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Request: ', (answer) => {
        p.parse(answer)

        rl.close();
        readRequest();
    });
}
readRequest();

//Testing commands
p.parse("connect localhost 3000");
p.parse("login user" + +Date.now());