var ansi = require('ansi')
  , cursor = ansi(process.stdout)

module.exports = class ClientHandler {
    constructor(socket, server) {
        const _that = this;

        this.socket = socket;
        this.loggedIn = false;
        this.connected = true;
        this.server = server;

        socket.setEncoding("utf8");
        socket.on('data', (data) => { _that.handleData(data) });
        socket.on('error', (err) => {
            if (err.code == "ECONNRESET") {
                _that.connected = false;
                _that.error("Client abrubtly disconnected");
                _that.server.removeClient(_that.socket.id);
            }
        });

        cursor.green();
        cursor.write("+> ");
        cursor.reset();

        console.log("Info: New client connected. | Socket: " + socket.id);
        socket.write("Something", "utf8");
    }

    handleData(data) {
        var data = JSON.parse(data);

        if (typeof data.request == "undefined" || typeof data.content == "undefined") {
            this.error("Malformed request");
        } 
        else {
            if (data.request == "msg") {
                console.log("MSG");
                //this.message(data.content);
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
            console.log("-> Info: Username set to " + username + " | Socket: " + this.socket.id);
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

    }

    message(msg) {
        this.server.broadcast(msg, this.socket.id);
    }

    logout() {
        this.server.logout(this.socket.id);
    }

    error(msg) {
        cursor.red();
        cursor.write("!> ");
        cursor.reset();
        console.log("Error: " + msg + " | Socket: " + this.socket.id);
        if (this.connected) this.write("error", msg);
    }

    write(response, content, sender) {
        console.log(sender);

        if (!sender) sender = "server"; // Sender is an optional argument. If no sender is specified, default to server.
        
        var response = JSON.stringify({
            timestamp: + new Date(),
            sender: sender,
            response: response,
            content: content
        });

        console.log(response);

        this.socket.write(response);
    }
}