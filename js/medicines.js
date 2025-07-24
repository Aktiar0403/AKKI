export async function loadMedicines() {
  try {
    const response = await fetch('./data/medicines.json');
    const medicines = await response.json();
    return medicines;
  } catch (error) {
    console.error('Failed to load medicines:', error);
    return [];
  }

}
export function getMedicinesForDiagnosis(diagnoses, allMedicines) {
  const relevantMeds = [];

  for (const diag of diagnoses) {
    const match = allMedicines.filter(med =>
      med.linkedDiagnosis && med.linkedDiagnosis.includes(diag.suggestion)
    );
    relevantMeds.push(...match);
  }

  // Remove duplicates
  const unique = Array.from(new Map(relevantMeds.map(med => [med.name, med])).values());
  return unique;
}
