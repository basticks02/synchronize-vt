require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const userRoutes = require('./user')

const express = require('express');
const app = express()
const port = 4000;

app.use(express.json());
app.use(cors());


app.use('/api/user', userRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
