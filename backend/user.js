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
            maxAge: 3600000, //session set for 15 minutes. Originally 3600000
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

// Fetching Patient Profile
router.get('/myprofile', authenticateToken, async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
});

//Delete Patient Profile
router.delete('/myprofile', authenticateToken, async (req, res) => {
  try{
    const deletedProfile = await prisma.patient.delete({
      where: {userId: req.user.id}
    })
    return res.status(200).json(deletedProfile)
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
})

//Edit Patient Profile
router.put('/myprofile', authenticateToken, async (req, res) => {
  const { firstname, lastname, place_of_birth, date_of_birth, sex, height, weight, occupation, address, phone, complaint } = req.body;

  try {
    const updatedPatient = await prisma.patient.update({
      where: { userId: req.user.id },
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
      }
    });
    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient profile:', error);
    res.status(500).json({ error: 'Failed to update patient profile' });
  }
});

//Posting a new Appointment
router.post('/appointments', authenticateToken, async (req, res) => {
  const { title, date, start_time, end_time, patientId } = req.body;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        title,
        date: new Date(date),
        start_time,
        end_time,
        patientId: patient.id,
      },
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

//Getting all appointments
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
      include: { appointments: true }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    res.status(200).json(patient.appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
})

//Deleteing an appointment
router.delete('/appointments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try{
    const deletedAppointment = await prisma.appointment.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json(deletedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
})

module.exports = router;
