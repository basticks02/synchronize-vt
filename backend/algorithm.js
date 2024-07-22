const symptoms = ['Fever', 'Cough', 'Headache', 'Diarrhea', 'Body Pain'];
const medications = ['Paracetamol', 'Amoxicillin', 'Ciprofloxacin', 'Ibuprofen', 'Metronidazole', 'Artemether/Lumefantrine', 'Vitamin C', 'Diclofenac'];

const ageGroupWeights = {
  child: [4, 4, 3, 3, 2],
  teenager: [3, 3, 4, 2, 2],
  adult: [3, 3, 4, 2, 4],
  elder: [2, 4, 2, 3, 5]
};

const medicationWeights = {
  Paracetamol: [4, 1, 5, 0, 4],
  Amoxicillin: [0, 5, 0, 5, 1],
  Ciprofloxacin: [0, 5, 0, 4, 1],
  Ibuprofen: [3, 1, 4, 0, 5],
  Metronidazole: [0, 0, 0, 5, 0],
  Artemether_Lumefantrine: [5, 4, 0, 3, 1],
  Vitamin_C: [1, 2, 1, 1, 1],
  Diclofenac: [3, 0, 3, 0, 5]
};

// Accessibility scores of each medicine
const accessibilityScores = {
  Paracetamol: 5,
  Amoxicillin: 4,
  Ciprofloxacin: 4,
  Ibuprofen: 5,
  Metronidazole: 3,
  Artemether_Lumefantrine: 4,
  Vitamin_C: 5,
  Diclofenac: 4
};

// Prices of each medication
const medicationPrices = {
  Paracetamol: 30,
  Amoxicillin: 25,
  Ciprofloxacin: 50,
  Ibuprofen: 20,
  Metronidazole: 15,
  Artemether_Lumefantrine: 40,
  Vitamin_C: 10,
  Diclofenac: 35
};

// Calculation of age from date of birth
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Age group based on age
function determineAgeGroup(age) {
  if (age < 12) return 'child';
  if (age >= 12 && age < 20) return 'teenager';
  if (age >= 20 && age < 60) return 'adult';
  return 'elder';
}

// Function to scale symptoms by patient priority and age group weights
function scaleSymptoms(priorities, ageGroup) {
  const ageWeights = ageGroupWeights[ageGroup];
  const scaledSymptoms = [];
  for (let i = 0; i < priorities.length; i++) {
    scaledSymptoms.push(priorities[i] * ageWeights[i]);
  }
  return scaledSymptoms;
}

// Function to scale medication weights by accessibility score
function scaleMedicationWeights(weights, accessibility) {
  const scaledWeights = [];
  for (let i = 0; i < weights.length; i++) {
    scaledWeights.push(weights[i] * accessibility);
  }
  return scaledWeights;
}

// Function to calculate the compatibility score
function calculateCompatibility(patientSymptoms, medicationWeights) {
  let compatibilityScore = 0;
  for (let i = 0; i < patientSymptoms.length; i++) {
    compatibilityScore += patientSymptoms[i] * medicationWeights[i];
  }
  return compatibilityScore;
}

// Function to normalize values
function normalize(value, maxValue) {
  return value / maxValue;
}

// Function to calculate the final score including the price factor
function calculateFinalScore(normalizedCompatibility, normalizedPrice, weightCompatibility = 0.6, weightPrice = 0.4) {
  return (normalizedCompatibility * weightCompatibility) + (normalizedPrice * weightPrice);
}

// Main function to recommend medication
function recommendMedication(patientData) {
  const { priorities, dateOfBirth } = patientData;
  const age = calculateAge(dateOfBirth);
  const ageGroup = determineAgeGroup(age);

  // Scale patient symptoms
  const scaledSymptoms = scaleSymptoms(priorities, ageGroup);

  let bestMedicationCompatibility = '';
  let highestCompatibilityScore = -Infinity;

  let bestMedicationFinal = '';
  let highestFinalScore = -Infinity;

  let maxCompatibility = -Infinity;
  let maxPrice = Math.max(...Object.values(medicationPrices));

  // Calculate compatibility scores for all medications to find max compatibility
  const compatibilityScores = Object.keys(medicationWeights).map(medication => {
    const scaledWeights = scaleMedicationWeights(medicationWeights[medication], accessibilityScores[medication]);
    const compatibility = calculateCompatibility(scaledSymptoms, scaledWeights);

    if (compatibility > maxCompatibility) {
      maxCompatibility = compatibility;
    }
    if (compatibility > highestCompatibilityScore) {
      highestCompatibilityScore = compatibility;
      bestMedicationCompatibility = medication;
    }
    return { medication, compatibility };
  });

  // Calculate final scores for each medication
  compatibilityScores.forEach(({ medication, compatibility }) => {
    const price = medicationPrices[medication];
    const invertedPrice = maxPrice - price;
    const normalizedCompatibility = normalize(compatibility, maxCompatibility);
    const normalizedPrice = normalize(invertedPrice, maxPrice);
    const finalScore = calculateFinalScore(normalizedCompatibility, normalizedPrice);

    if (finalScore > highestFinalScore) {
      highestFinalScore = finalScore;
      bestMedicationFinal = medication;
    }
  });

  return {
    bestMedicationCompatibility,
    bestMedicationFinal
  };
}

// Dummy patient data for testing
const dummyPatientData = {
  priorities: [4, 1, 2, 5, 3],
  dateOfBirth: '2022-07-16'
};

const { bestMedicationCompatibility, bestMedicationFinal } = recommendMedication(dummyPatientData);
module.exports = { recommendMedication };
