const express = require('express')
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY

//Middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  };

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

        const token = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: '1h'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 300000, //session set for 5 minutes. Originally 3600000
        });

        res.status(200).json({message:'Login Successsful', user})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Login failed' });
    }
})

//Get current user
router.get('/current', authenticateToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch current user' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

//Creating Patient Profile
router.post('/myprofile', authenticateToken, async (req, res) => {
  const { firstname, lastname, place_of_birth, date_of_birth, sex, height, weight, occupation, address, phone, complaint } = req.body;

  try {
    //ensures that another patient profile isn't created
    const existingPatient = await prisma.patient.findUnique({
        where: { userId: req.user.id }
    });

    if (existingPatient) {
        return res.status(400).json({ error: 'Patient profile already exists for this user' });
    }

    const newPatient = await prisma.patient.create({
      data: {
        firstname,
        lastname,
        place_of_birth,
        date_of_birth: new Date(date_of_birth),
        sex,
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
        occupation,
        address,
        phone,
        complaint,
        userId: req.user.id
      }
    });
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient profile:', error);
    res.status(500).json({ error: 'Failed to create patient profile' });
  }
});

//TODO Fetching Patient Profile


module.exports = router;
