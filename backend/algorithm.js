const symptoms = ['Fever', 'Cough', 'Headache', 'Diarrhea', 'Body Pain'];
const medications = ['Paracetamol', 'Amoxicillin', 'Ciprofloxacin', 'Ibuprofen', 'Metronidazole', 'Artemether/Lumefantrine', 'Vitamin C', 'Diclofenac'];

const ageGroupWeights = {
    child: [4, 4, 3, 3, 2],
    teenager: [3, 3, 4, 2, 2],
    adult: [3, 3, 4, 2, 4],
    elder: [2, 4, 2, 3, 5]
  };

const medicationWeights = [
    [4, 1, 5, 0, 4], // Paracetamol
    [0, 5, 0, 5, 1], // Amoxicillin
    [0, 5, 0, 4, 1], // Ciprofloxacin
    [3, 1, 4, 0, 5], // Ibuprofen
    [0, 0, 0, 5, 0], // Metronidazole
    [5, 4, 0, 3, 1], // Artemether/Lumefantrine
    [1, 2, 1, 1, 1], // Vitamin C
    [3, 0, 3, 0, 5]  // Diclofenac
];

//accessiility scores of each medicine
const accessibilityScores = [5, 4, 4, 5, 3, 4, 5, 4];

//prices of each medication
const medicationPrices = [30, 25, 50, 20, 15, 40, 10, 35];

//calculation of age from date of birth
function calculateAge(date_of_birth) {
    const birthDate = new Date(date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
}

//age group based on age
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
