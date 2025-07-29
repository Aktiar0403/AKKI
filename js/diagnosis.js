// diagnosis.js – final refactored version for NephroCare Pro

export let diagnosisRules = [];

// Load diagnosis rules from external enriched JSON file
export async function loadDiagnosisRulesFromFile(url = './data/diagnosisRules.json') {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load diagnosis rules');
    diagnosisRules = await response.json();
    return diagnosisRules;
  } catch (error) {
    console.error('Error loading diagnosis rules:', error);
    return [];
  }
}

// Evaluate a single condition
export function evaluateCondition(cond, visit) {
  const sectionData = visit[cond.section];
  if (!sectionData) return false;
  const val = sectionData[cond.field];
  if (val === undefined) return false;

  switch (cond.operator) {
    case "<": return parseFloat(val) < cond.value;
    case ">": return parseFloat(val) > cond.value;
    case "==": return val == cond.value;
    case "in": return cond.value.includes(val);
    default: return false;
  }
}

// Evaluate a full rule (simple/multi/compound)
export function evaluateRule(rule, visit) {
  if (rule.conditions) {
    return rule.conditions.every(cond => evaluateCondition(cond, visit));
  }
  if (rule.test && rule.operator && rule.threshold !== undefined) {
    return evaluateCondition({
      section: 'blood',
      field: rule.test,
      operator: rule.operator,
      value: rule.threshold
    }, visit);
  }
  return false;
}

// Main function to return enriched diagnosis objects
export function generateDiagnosisText(visit) {
  return diagnosisRules.filter(rule => evaluateRule(rule, visit));
}

// Extract missing fields from rules that could have matched
export function getMissingFields(visit) {
  const missing = new Set();
  for (const rule of diagnosisRules) {
    if (!evaluateRule(rule, visit) && rule.conditions) {
      rule.conditions.forEach(cond => {
        const section = visit[cond.section];
        if (!section || section[cond.field] === undefined || section[cond.field] === "") {
          missing.add(`${cond.section}.${cond.field}`);
        }
      });
    }
  }
  return Array.from(missing);
}

export function addDiagnosisRule(rule) {
  diagnosisRules.push(rule);
  localStorage.setItem('diagnosisRules', JSON.stringify(diagnosisRules));
}

export function deleteDiagnosisRule(index) {
  diagnosisRules.splice(index, 1);
  localStorage.setItem('diagnosisRules', JSON.stringify(diagnosisRules));
}
