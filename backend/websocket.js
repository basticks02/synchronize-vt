const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

let userToWS = {};

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws, req) => {
        console.log('Client connected');
        ws.send(JSON.stringify({ message: 'Welcome new client!' }));

        const user = await jwt.verify(req.headers.cookie.split("; ").find(cookie => cookie.startsWith("token=")).slice("token=".length), SECRET_KEY);

        userToWS[user.id] = (notificationData) => {
            notificationData.isNotification = true;
            ws.send(JSON.stringify(notificationData))
        }

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
            delete userToWS[user.id];
            console.log('Client disconnected');
            
        });
    });
}

module.exports = {setupWebSocket, userToWS};
