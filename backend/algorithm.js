const NodeCache = require('node-cache');
const myCache = new NodeCache();

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

// Generate a cache key based on symptoms, age group, and age
function generateCacheKey(symptoms, age) {
  const ageGroup = determineAgeGroup(age);
  return `${symptoms.join('-')}-${ageGroup}-${age}`;
}

// Function to scale symptoms by patient priority and age group weights
function scaleSymptoms(priorities, ageGroup) {
  const ageWeights = ageGroupWeights[ageGroup];
  return priorities.map((priority, i) => priority * ageWeights[i]);
}

// Function to scale medication weights by accessibility score
function scaleMedicationWeights(weights, accessibility) {
  return weights.map(weight => weight * accessibility);
}

// Function to calculate the compatibility score
function calculateCompatibility(patientSymptoms, medicationWeights) {
  return patientSymptoms.reduce((score, symptom, i) => score + symptom * medicationWeights[i], 0);
}

// Function to normalize values
function normalize(value, maxValue) {
  return value / maxValue;
}

// Function to calculate the final score including the price factor
function calculateFinalScore(normalizedCompatibility, normalizedPrice, weightCompatibility = 0.6, weightPrice = 0.4) {
  return (normalizedCompatibility * weightCompatibility) + (normalizedPrice * weightPrice);
}

// Function to calculate the distance between two symptom vectors
function calculateDistance(vector1, vector2) {
  return Math.sqrt(vector1.reduce((sum, val, i) => sum + Math.pow(val - vector2[i], 2), 0));
}

// Main function to recommend medication
function recommendMedication(patientData) {
  const { priorities, dateOfBirth } = patientData;
  const age = calculateAge(dateOfBirth);
  const ageGroup = determineAgeGroup(age);

  // Level 1 Caching: Check for exact match
  const cacheKey = generateCacheKey(priorities, age);
  const exactCachedResult = myCache.get(cacheKey);
  if (exactCachedResult) {
    return exactCachedResult.result;
  }

  // Level 2 Caching: Check for existing cached result within the symptom vector distance range
  const cacheEntries = myCache.keys();
  for (const key of cacheEntries) {
    const cachedData = myCache.get(key);
    const distance = calculateDistance(priorities, cachedData.priorities);
    const level_2_threshold = 3
    if (distance <= level_2_threshold) {
      return cachedData.result;
    }
  }

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

  // Level 3 Caching: Check for compatibility score similarity
  for (const key of cacheEntries) {
    const cachedData = myCache.get(key);
    const level_3_threshold = 100
    if (Math.abs(cachedData.maxCompatibility - maxCompatibility) <= level_3_threshold) {
      return cachedData.result;
    }
  }

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

  const result = {
    bestMedicationCompatibility,
    bestMedicationFinal
  };

  // Cache the result
  myCache.set(cacheKey, { priorities, result, maxCompatibility });
  return result;
}

module.exports = { recommendMedication };
