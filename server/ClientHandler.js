var ansi = require('ansi')
  , cursor = ansi(process.stdout)

module.exports = class ClientHandler {
    constructor(socket, server) {
        const self = this;

        this.socket = socket;
        this.loggedIn = false;
        this.connected = true;
        this.server = server;

        socket.setEncoding("utf8");
        socket.on('data', (data) => { self.handleData(data) });
        socket.on('error', (err) => {
            if (err.code == "ECONNRESET") {
                self.connected = false;
                self.error("Client abrubtly disconnected");
                self.server.removeClient(self.socket.id);
            }
        });

        this.server.log("Info: New client connected. | Socket: " + socket.id, "add");
        socket.write("Something", "utf8");
    }

    handleData(data) {
        var data = JSON.parse(data);

        if (typeof data.request == "undefined" || typeof data.content == "undefined") {
            this.error("Malformed request");
        } 
        else {
            if (data.request == "msg") {
                this.message(data.content);
            } else if (data.request == "login") {
                this.login(data.content);
            } else if (data.request == "names") {
                this.names();
            } else if (data.request == "history") {
                this.history();
            }
        }
    }

    login(username) {
        //get username
        if (!this.server.usernameExists(username)) {
            this.username = username;
            this.loggedIn = true;
            this.server.log("Info: Username set to " + username + " | Socket: " + this.socket.id);
            //Send history
        } else {
            this.error("User exists");
        }
    }

    help() {
        //list possible commands
    }

    names() {
        //return list of usernames
    }

    history() {
        //Might need to shard / make chunks? History could be quite big.
        var history = this.server.getHistory();
        this.write("history", history);
        this.server.log(`Sent history to ${this.socket.id} (${history.length})`, "info");
    }

    message(msg) {
        this.server.broadcast(msg, this.socket.id);
    }

    logout() {
        this.server.logout(this.socket.id);
    }

    error(msg) {
        this.server.log("Error: " + msg + " | Socket: " + this.socket.id, "error");
        if (this.connected) this.write("error", msg);
    }

    write(responseType, content, sender) {
        if (!sender) sender = "server"; // Sender is an optional argument. If no sender is specified, default to server.
        
        var response = JSON.stringify({
            timestamp: + new Date(),
            sender: sender,
            response: responseType,
            content: content
        });

        this.socket.write(response);
        if (responseType == "msg") this.server.pushToHistory(response);
    }
}