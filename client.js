const readline = require('readline');
const chatClient = require('./classes/chatClient.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var client;
var connected = false;
var exit = false;

getRequest();
function getRequest() {
    rl.question("Request: ", (ans) => {
        //Checks
        if (ans.length == 0) {
            rl.close();
            return;
        }
        
        //Juice
        RequestArray = ans.split(' ');
        if (RequestArray[0] == "connect") {
            var host = RequestArray[1];
            var port = RequestArray[2];
            var username = RequestArray[3];

            client = new chatClient(host, port, username, {
                debug: true
            });
        }

        if (RequestArray[0] == "exit") {
            process.abort();
        }

        rl.close();
        getRequest();
    });
}
