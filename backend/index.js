require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./user');
const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./websocket');
const axios = require('axios'); // For making external requests

const app = express();
const port = 4000;

// Middleware
const allowedOrigins = ['http://emms-synchronize.co', 'https://synchronize-vt-1.onrender.com'];

app.use(cors({
    origin: function (origin, callback) {
        // Check if the origin is in the allowedOrigins array or if there's no origin (for non-browser clients)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


// User Routes
app.use('/api/user', userRoutes);

// Chatbot Route
const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;

const headers = {
    'Content-Type': 'application/json',
    'api-key': API_KEY,
};

app.post('/chat', async (req, res) => {
    const user_input = req.body.message || '';

    const payload = {
        messages: [
            {
                role: 'system',
                content: 'You are an AI assistant that helps people find information on a website and provide health-related information. The Vision: To be a one-stop center for excellent service delivery. The Mission: To reach the underserved population in particular and everyone with the best medical care. Contacts: +2347082210979, +2348173922714, enoobongmemorial@yahoo.com',
            },
            {
                role: 'user',
                content: user_input,
            },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
    };

    try {
        const response = await axios.post(ENDPOINT, payload, { headers });
        const assistantMessage = response.data.choices[0].message.content;
        res.json({ response: assistantMessage });
    } catch (error) {
        console.error('Error making API request:', error.message);
        res.status(500).json({ response: 'Sorry, I encountered an error.' });
    }
});

// WebSocket Setup
const server = http.createServer(app);
setupWebSocket(server);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
