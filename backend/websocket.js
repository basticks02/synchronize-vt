const WebSocket = require('ws');

let wss = null;

const setupWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    wss.broadcast = (data) => {
        const message = JSON.stringify(data);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
                console.log(`Sent message: ${message}`);
            }
        });
    };

    return wss;
};

const getWebSocketServer = () => wss;

module.exports = { setupWebSocket, getWebSocketServer };
