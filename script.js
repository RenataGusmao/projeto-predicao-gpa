const form = document.querySelector("#prediction-form");
const gpaValue = document.querySelector("#gpa-value");
const interpretation = document.querySelector("#interpretation");
const statusMessage = document.querySelector("#status-message");

const numericFields = new Set([
  "Pre_Semester_GPA",
  "Weekly_GenAI_Hours",
  "Tool_Diversity",
  "Traditional_Study_Hours",
  "Perceived_AI_Dependency",
  "Anxiety_Level_During_Exams",
  "Skill_Retention_Score",
]);

const integerFields = new Set([
  "Tool_Diversity",
  "Perceived_AI_Dependency",
  "Anxiety_Level_During_Exams",
]);

const categoryAdjustments = {
  Major_Category: {
    STEM: 0.03,
    Business: 0.02,
    Humanities: 0,
    Medical: 0.01,
    Arts: -0.01,
  },
  Year_of_Study: {
    Freshman: -0.04,
    Sophomore: -0.02,
    Junior: 0,
    Senior: 0.02,
    Graduate: 0.04,
  },
  Primary_Use_Case: {
    Summarizing_Reading: 0.04,
    Ideation: 0.03,
    Direct_Answer_Generation: -0.05,
    "Debugging/Troubleshooting": 0.02,
    "Copywriting/Drafting": 0,
  },
  Prompt_Engineering_Skill: {
    Beginner: -0.04,
    Intermediate: 0.01,
    Advanced: 0.05,
  },
  Institutional_Policy: {
    Allowed_With_Citation: 0.02,
    Actively_Encouraged: 0.03,
    Strict_Ban: -0.04,
  },
  Burnout_Risk_Level: {
    Low: 0.04,
    Medium: 0,
    High: -0.08,
  },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getInterpretation(gpa) {
  if (gpa >= 3.5) {
    return "Alto desempenho previsto";
  }

  if (gpa >= 2.5) {
    return "Desempenho intermediario previsto";
  }

  return "Atencao: desempenho previsto abaixo do ideal";
}

function buildPayload(formData) {
  const payload = {};

  for (const [key, value] of formData.entries()) {
    if (key === "Paid_Subscription") {
      payload[key] = value === "true";
    } else if (integerFields.has(key)) {
      payload[key] = Number.parseInt(value, 10);
    } else if (numericFields.has(key)) {
      payload[key] = Number.parseFloat(value);
    } else {
      payload[key] = value;
    }
  }

  return payload;
}

function getCategoryAdjustment(field, value) {
  return categoryAdjustments[field]?.[value] ?? 0;
}

function predictGpa(input) {
  let score = input.Pre_Semester_GPA;

  score += (input.Traditional_Study_Hours - 14) * 0.018;
  score += (input.Skill_Retention_Score - 75) * 0.006;
  score += (input.Tool_Diversity - 3) * 0.018;

  const balancedAiUse = 10 - Math.abs(input.Weekly_GenAI_Hours - 8);
  score += balancedAiUse * 0.012;
  score -= Math.max(input.Weekly_GenAI_Hours - 18, 0) * 0.018;
  score -= (input.Perceived_AI_Dependency - 4) * 0.028;
  score -= (input.Anxiety_Level_During_Exams - 4) * 0.025;

  if (input.Paid_Subscription) {
    score += 0.02;
  }

  score += getCategoryAdjustment("Major_Category", input.Major_Category);
  score += getCategoryAdjustment("Year_of_Study", input.Year_of_Study);
  score += getCategoryAdjustment("Primary_Use_Case", input.Primary_Use_Case);
  score += getCategoryAdjustment("Prompt_Engineering_Skill", input.Prompt_Engineering_Skill);
  score += getCategoryAdjustment("Institutional_Policy", input.Institutional_Policy);
  score += getCategoryAdjustment("Burnout_Risk_Level", input.Burnout_Risk_Level);

  return clamp(score, 0, 4);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = buildPayload(new FormData(form));
  const predictedGpa = predictGpa(payload);

  gpaValue.textContent = predictedGpa.toFixed(2);
  interpretation.textContent = getInterpretation(predictedGpa);
  statusMessage.textContent = "Predicao gerada no navegador, sem uso de backend.";
  statusMessage.classList.remove("error");
});
