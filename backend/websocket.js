const WebSocket = require('ws');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.send(JSON.stringify({ message: 'Welcome new client!' }));

        ws.on('message', (message) => {
            console.log(`Received message => ${message}`);
            
            // Broadcast the message to all clients except the sender
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = setupWebSocket;
