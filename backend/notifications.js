const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DaysRange = 3;
const conditionWeights = {
    hasUpcomingAppointments: 2,
    hasManyAppointments: 1,
    isElder: 4,
    isInfant: 3
};

const checkNotificationConditions = async (patientId) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: { appointments: true },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  const today = new Date();
  const age = today.getFullYear() - patient.date_of_birth.getFullYear();
  const upcomingAppointments = patient.appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const timeDifference = appointmentDate - today;
    return timeDifference >= 0 && timeDifference <= DaysRange * 24 * 60 * 60 * 1000;
  })

  const conditions = {
    hasUpcomingAppointments: upcomingAppointments.length > 0,
    hasManyAppointments: patient.appointments.length >= 5,
    isElder: age >= 60,
    isInfant: age <= 1,
  };

  const totalWeight = Object.keys(conditions).reduce((sum, condition) => {
    return sum + (conditions[condition] ? conditionWeights[condition] : 0);
  }, 0);

  return { conditions, totalWeight };
};

module.exports = { checkNotificationConditions };
