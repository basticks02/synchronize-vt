const express = require('express')
const bcrypt = require ('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

//const SECRET_KEY = process.env.SECRET_KEY

//Signup
router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Please fill out all fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role
            }
        })
        res.status(201).json(newUser)
    } catch (error){
        console.error(error);
        res.status(500).json({error: 'Failed to create user'})
    }
})

//Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please fill out all fields' });
    }

    try{
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        //TODO: Add Session commsnd here

        res.status(200).json({message:'Login Successsful', user})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Login failed' });
    }
})

module.exports = router;
