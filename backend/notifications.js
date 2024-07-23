const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DaysRange = 3;

const checkNotificationConditions = async (patientId) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: { appointments: true },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  const today = new Date();
  const birthDate = new Date(patient.date_of_birth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const upcomingAppointments = patient.appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const timeDifference = appointmentDate - today;
    return timeDifference >= 0 && timeDifference <= DaysRange * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  });

  const conditions = {
    hasUpcomingAppointments: upcomingAppointments.length > 0,
    hasManyAppointments: patient.appointments.length >= 5,
    isElder: age >= 60,
    isInfant: age <= 1,
  };

  return conditions;
};

module.exports = { checkNotificationConditions };
