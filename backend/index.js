require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./user');
const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./websocket');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/user', userRoutes);

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
