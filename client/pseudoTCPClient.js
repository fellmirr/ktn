class TCPClient {
    constructor(host, port) {

    }

    login(username) {
        sendToServer("login", username);
    }

    sendMsg(msg) {
        sendToServer("msg", msg);
    }

    names() {
        sendToServer("names", null);
    }

    help() {
        sendToServer("help", null);
    }

    logout() {
        sendToServer("logout", null);
    }

    sendToServer(request, content) {
        this.client.write(JSON.stringify({
            request: request,
            content: content
        }));
    }

    handleResponse() {
        
    }
}