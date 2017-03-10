class ClientHandler {
    constructor(socket, server) {
        this.socket = socket;
        this.server = server;
        this.loggedIn = false;

        socket.setEncoding("utf8");
        socket.on('data', handleData);
    }

    handleData(data) {
        /*
            What what kind of message this is

        */

        //login
    }

    login() {
        //get username
        if (!server.userExists(username)) {
            this.username = username;
            this.loggedIn = true;
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

    message() {
        server.broadcast(msg, this.socket.id);
    }

    logout() {
        server.logout(this.socket.id);
    }
}