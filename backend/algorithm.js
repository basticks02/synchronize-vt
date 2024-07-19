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


//accessiility scores of each medicine
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

//prices of each medication
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

//calculation of age from date of birth
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
