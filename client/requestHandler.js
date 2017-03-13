'use strict'
class RequestHandler {
    constructor() {
        this.connected = false;
        this.requstArray
        this.possibleRequests = ['msg', 'connect', 'login', 'logout', 'exit', 'help', 'names']
        console.log('Connect with:\r\nconnect host port\r\ne.g. "connect localhost 3000"');
    
    }

    parse(input) {
        // check if answer is blank
        if(input.length == 0) {
            return;
        }
        this.requstArray = input.split(' ');
        console.log(this.requstArray[0] in this.possibleRequests)
        console.log(this.requstArray[0])
        console.log(this.possibleRequests)

        if(this.requstArray[0] in this.possibleRequests){
            console.log('Error: command not possible')
            return
        }
        //connect

        // args are host and port
        if(this.connected == false){
            try{this.client = new TCPClient(requstArray[1], requstArray[2]);
            this.connected = true;
            } catch { console.log("Did you write the correct host and port?") }
        }
        //this.
        //msg

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