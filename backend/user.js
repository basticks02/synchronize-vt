const express = require('express')
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const {userToWS} = require('./websocket');
const {recommendMedication} = require('./algorithm')
const _ = require('lodash');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


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

// Find patient helper function
const findPatient = async (identifier, idType = 'userId', includePhysician = false) => {
  const include = includePhysician ? { include: { physician: true } } : {};
  const whereClause = idType === 'userId' ? { userId: identifier } : { id: identifier };

  const patient = await prisma.patient.findUnique({
    where: whereClause,
    ...include
  });

  if (!patient) {
    throw new Error('Patient profile not found');
  }

  return patient;
};

// Route to get medication recommendation based on patient symptoms
router.get('/recommend', authenticateToken, async (req, res) => {
  const { patientId } = req.query;

  try {
    let patient;
    if (req.user.role === 'physician' && patientId) {
      patient = await findPatient(parseInt(patientId, 10), 'id');
    } else {
      patient = await findPatient(req.user.id, 'userId');
    }

    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const patientData = {
      priorities: patient.symptoms.map(s => s.priority),
      dateOfBirth: patient.date_of_birth
    };

    const { bestMedicationCompatibility, bestMedicationFinal } = recommendMedication(patientData);
    res.status(200).json({ bestMedicationCompatibility, bestMedicationFinal });
  } catch (error) {
    console.error('Error recommending medication:', error);
    res.status(500).json({ error: 'Failed to recommend medication' });
  }
});

//Helper function for creating notifications & sending websocket messages
  const createNotification = async (content, patientId, physicianId, userId) => {
    try {
      const newNotification = await prisma.notification.create({
        data: {
          content,
          patientId,
          physicianId,
        },
      });

      // Send notification via WebSocket
      if (userToWS[userId]) {
        userToWS[userId]({
          message: content,
          isNotification: true,
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };



//Signup
router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Please fill out all fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        if (role === 'physician') {
        // Check if a physician already exists
          const existingPhysician = await prisma.physician.findFirst();
          if (existingPhysician) {
              return res.status(400).json({ error: 'A physician account already exists' });
          }
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role
            }
        })

        if (role === 'physician') {
          await prisma.physician.create({
              data: {
                  userId: newUser.id
              }
          });
        }

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

        const token = jwt.sign({id: user.id, email: user.email, role: user.role}, SECRET_KEY, {expiresIn: '1h'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
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
  const { firstname, lastname, place_of_birth, date_of_birth, sex, height, weight, occupation, address, phone, symptoms } = req.body;

  try {
    //ensures that another patient profile isn't created
    const existingPatient = await prisma.patient.findUnique({
        where: { userId: req.user.id }
    });

    if (existingPatient) {
        return res.status(400).json({ error: 'Patient profile already exists for this user' });
    }

    //fetches only physician
    const physician = await prisma.physician.findFirst();

    if (!physician) {
        return res.status(404).json({ error: 'Physician not found' });
    }

    const parsedSymptoms = symptoms ? JSON.parse(symptoms) : [];

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
        symptoms: parsedSymptoms,
        userId: req.user.id,
        physicianId: physician.id,
        notificationsOn: true
      }
    });

    // Create a new notification for the physician
    const newNotification = await prisma.notification.create({
      data: {
        content: `New patient profile created: ${firstname} ${lastname}`,
        physicianId: physician.id,
      },
    });

    // Send notification via WebSocket
    if (userToWS[physician.userId]) {
      userToWS[physician.userId]({
        message: `New patient profile created: ${firstname} ${lastname}`,
        isNotification: true,
      });
    }

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient profile:', error);
    res.status(500).json({ error: 'Failed to create patient profile' });
  }
});

// Fetching Patient Profile
router.get('/myprofile', authenticateToken, async (req, res) => {
  try {
    const patient = await findPatient(req.user.id);
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
});

// Delete Patient Profile
router.delete('/myprofile', authenticateToken, async (req, res) => {
  try {
    // Find the patient profile to be deleted
    const patient = await findPatient(req.user.id);
    // Delete the patient profile
    const deletedProfile = await prisma.patient.delete({
      where: { userId: req.user.id }
    });

    // Create a new notification for the physician
    const physician = patient.physician;
    if (physician) {
      const newNotification = await prisma.notification.create({
        data: {
          content: `Patient profile deleted: ${patient.firstname} ${patient.lastname}`,
          physicianId: physician.id,
        },
      });

      // Send notification via WebSocket
      if (userToWS[physician.userId]) {
        userToWS[physician.userId]({
          message: `Patient profile deleted: ${patient.firstname} ${patient.lastname}`,
          isNotification: true,
        });
      }
    }

    return res.status(200).json(deletedProfile);
  } catch (error) {
    console.error('Error deleting patient profile:', error);
    res.status(500).json({ error: 'Failed to delete patient profile' });
  }
});


// Edit Patient Profile
router.put('/myprofile', authenticateToken, upload.single('image'), async (req, res) => {
  const { firstname, lastname, place_of_birth, date_of_birth, sex, height, weight, occupation, address, phone, symptoms } = req.body;

  try {
    // Fetch current patient data
    const currentPatient = await findPatient(req.user.id, 'userId', true);
    // Prepare the updated data
    const parsedSymptoms = symptoms ? JSON.parse(symptoms) : [];
    const updatedData = {
      firstname: firstname || currentPatient.firstname,
      lastname: lastname || currentPatient.lastname,
      place_of_birth: place_of_birth || currentPatient.place_of_birth,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : currentPatient.date_of_birth,
      sex: sex || currentPatient.sex,
      height: height ? parseInt(height, 10) : currentPatient.height,
      weight: weight ? parseInt(weight, 10) : currentPatient.weight,
      occupation: occupation || currentPatient.occupation,
      address: address || currentPatient.address,
      phone: phone || currentPatient.phone,
      symptoms: parsedSymptoms.length > 0 ? parsedSymptoms : currentPatient.symptoms,
    };

    if (req.file) {
      console.log('Uploading file to Cloudinary:', req.file.path);
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log('Cloudinary upload result:', result);
      updatedData.profileImage = result.secure_url;
    }

    // Update the patient profile
    const updatedPatient = await prisma.patient.update({
      where: { userId: req.user.id },
      data: updatedData
    });

    const physician = currentPatient.physician;

    // Check what fields were changed and create notifications
    const changes = [];
    for (const [key, value] of Object.entries(updatedData)) {
      if (key === 'symptoms') {
        if (!_.isEqual(currentPatient[key], value)) {
          changes.push(key);
        }
      } else if (currentPatient[key] !== value) {
        changes.push(key);
      }
    }


    // Notification messages for specific changes
    const changeMessages = {
      firstname: `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} changed their name.`,
      lastname: `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} changed their name.`,
      place_of_birth: `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} changed their place of birth.`,
      occupation: `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} changed their occupation.`,
      address: `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} changed their address.`,
      symptoms: `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} changed their symptoms preference.`,
      profileImage: `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} updated their profile picture.`,
    };

    // Create notifications based on changes if notifications are enabled for the patient
    let specificNotificationSent = false;
    if (currentPatient.notificationsOn) {
      for (const change of changes) {
        if (changeMessages[change]) {
          specificNotificationSent = true;
          const message = changeMessages[change];

          if (physician) {
            await createNotification(message, null, physician.id, physician.userId);
          }
        }
      }

      // If no specific change notification was sent, send a generic update notification
      if (!specificNotificationSent && physician) {
        const genericMessage = `Patient profile edited: ${currentPatient.firstname} ${currentPatient.lastname} updated their profile.`;
        await createNotification(genericMessage, null, physician.id, physician.userId);
      }
    }

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
    const patient = await findPatient(patientId, 'id');
    const newAppointment = await prisma.appointment.create({
      data: {
        title,
        date: new Date(date),
        start_time,
        end_time,
        patientId: patient.id,
      },
    });

    if (patient.notificationsOn){
      const newNotification = await prisma.notification.create({
        data: {
          content: `New appointment created: ${title} on ${date}`,
          patientId: patient.id,
        },
      });

      if (userToWS[patient.userId]) {
        userToWS[patient.userId]({
          message: "New Appointment",
          isNotification: true,
        });
      }
    }

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});


//Getting all appointments
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const patient = await findPatient(req.user.id);
    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { date: 'asc' }
    });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
})

// Deleting an appointment
router.delete('/appointments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the appointment and its associated patient before deleting
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id, 10) },
      include: { patient: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const deletedAppointment = await prisma.appointment.delete({
      where: { id: parseInt(id, 10) },
    });

    if (appointment.patient.notificationsOn){
      // Create a new notification
      const content = `Deleted Appointment: ${appointment.title} on ${appointment.date}`;
      await createNotification(content, appointment.patient.id, null, appointment.patient.userId);
    }

    res.status(200).json(deletedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id, 10) },
      data: { read: true },
    });

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});



// Getting notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    let notifications = [];

    if (req.user.role === 'patient') {
      const patient = await findPatient(req.user.id);
      notifications = await prisma.notification.findMany({
        where: { patientId: patient.id },
        orderBy: { timestamp: 'desc' },
      });
    } else if (req.user.role === 'physician') {
      const physician = await prisma.physician.findUnique({
        where: { userId: req.user.id },
      });

      if (!physician) {
        return res.status(404).json({ error: 'Physician not found' });
      }

      notifications = await prisma.notification.findMany({
        where: { physicianId: physician.id },
        orderBy: { timestamp: 'desc' },
      });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Toggle notification status for a patient
router.put('/patients/:id/toggle-notifications', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: parseInt(id, 10) },
      data: { notificationsOn: !patient.notificationsOn },
    });

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error('Error toggling notifications:', error);
    res.status(500).json({ error: 'Failed to toggle notifications' });
  }
});





// Editing an appointment
router.put('/appointments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, date, start_time, end_time } = req.body;

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        date: new Date(date),
        start_time,
        end_time
      }
    });

    // Find the patient associated with this appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id, 10) },
      include: { patient: true }
    });

    if (!appointment || !appointment.patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    const patient = appointment.patient;

    if (patient.notificationsOn){
      // Create a new notification
      const content = `Updated Appointment: ${title} on ${date}`;
      await createNotification(content, patient.id, null, patient.userId);
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});


//Fetching all patients data
router.get('/patients', authenticateToken, async (req, res) => {
  try {
      const physician = await prisma.physician.findUnique({
          where: { userId: req.user.id },
          include: { patients: true }
      });

      if (!physician) {
          return res.status(404).json({ error: 'Physician not found' });
      }

      res.status(200).json(physician.patients);
  } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

//Fetchind specific Patient data
router.get('/patients/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
});


//Fetching particular Patient's appointments
router.get('/patients/:id/appointments', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: parseInt(id) },
      orderBy: { date: 'asc' }, // This will order the appointments by date
    });

    if (!appointments) {
      return res.status(404).json({ error: 'Appointments not found' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});


module.exports = router;
