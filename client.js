const readline = require('readline');
const chatClient = require('./classes/chatClient.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var client;
var connected = false;
var exit = false;

getCommand();
function getCommand() {
    rl.question("Command: ", (ans) => {
        //Checks
        if (ans.length == 0) {
            rl.close();
            return;
        }
        
        //Juice
        commandArray = ans.split(' ');
        if (commandArray[0] == "connect") {
            var host = commandArray[1];
            var port = commandArray[2];
            var username = commandArray[3];

            client = new chatClient(host, port, username, {
                debug: true
            });
        }

        if (commandArray[0] == "exit") {
            process.abort();
        }

        rl.close();
        getCommand();
    });
}
