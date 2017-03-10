var EventEmitter = require("events").EventEmitter;

module.exports = class TCP { 
    constructor() {
        this.events = new EventEmitter();
        this.events.emit('someEvent');
    }
}