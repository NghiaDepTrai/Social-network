import * as io from 'socket.io-client';
const events = require('events');
class ChatSocketServer {

    socket = null
    // Connecting to Socket Server
    establishSocketConnection(userId) {
        try {
            this.socket = io(`http://localhost:5000`, {
                query: `userId=${userId}`
            });
        } catch (error) {
            alert(`Something went wrong; Can't connect to socket server`);
        }
    }

    sendMessage(message) {
        this.socket.emit('add-message', message);
    }

    receiveMessage() {
        if(this.socket) {
            this.socket.on('add-message-response', (data) => {
                this.eventEmitter.emit('add-message-response', data);
            });
        }
       
    }

    logout(userId) {
        this.socket.emit('logout', userId);
        this.socket.on('logout-response', (data) => {
            this.eventEmitter.emit('logout-response', data);
        });
    }

}

export default new ChatSocketServer()