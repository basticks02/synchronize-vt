require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRoutes = require('./user')
const express = require('express');

const app = express()
const port = 4000;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.use('/api/user', userRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
