const TCP = require('./tcp.js');
const events = require("events");

class Parser {
    constructor() {
        this.tcp = new TCP();

        this.tcp.events.on('someEvent', () => {
            console.log("Some events");
        });

        setTimeout(function() {
            console.log("Exit");
        }, 3000);
    }
}

var parser = new Parser();