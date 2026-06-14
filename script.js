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

const categoricalFields = [
  "Major_Category",
  "Year_of_Study",
  "Primary_Use_Case",
  "Prompt_Engineering_Skill",
  "Institutional_Policy",
  "Burnout_Risk_Level",
];

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

function encodeInput(input, columns) {
  return columns.map((column) => {
    if (numericFields.has(column)) {
      return input[column] ?? 0;
    }

    if (typeof input[column] === "boolean") {
      return input[column] ? 1 : 0;
    }

    for (const field of categoricalFields) {
      const prefix = `${field}_`;

      if (column.startsWith(prefix)) {
        const expectedValue = column.slice(prefix.length);
        return String(input[field]) === expectedValue ? 1 : 0;
      }
    }

    return 0;
  });
}

function predictTree(tree, values) {
  let node = 0;

  while (tree.childrenLeft[node] !== -1) {
    const featureIndex = tree.feature[node];
    const threshold = tree.threshold[node];
    node = values[featureIndex] <= threshold
      ? tree.childrenLeft[node]
      : tree.childrenRight[node];
  }

  return tree.value[node];
}

function predictGpa(input) {
  const model = window.EDUPREDICT_MODEL;

  if (!model) {
    throw new Error("Modelo treinado nao foi carregado.");
  }

  const values = encodeInput(input, model.columns);
  const total = model.trees.reduce((sum, tree) => sum + predictTree(tree, values), 0);

  return clamp(total / model.trees.length, 0, 4);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const payload = buildPayload(new FormData(form));
    const predictedGpa = predictGpa(payload);

    gpaValue.textContent = predictedGpa.toFixed(2);
    interpretation.textContent = getInterpretation(predictedGpa);
    statusMessage.textContent = "Predicao gerada com o modelo treinado exportado para o navegador.";
    statusMessage.classList.remove("error");
  } catch (error) {
    gpaValue.textContent = "--";
    interpretation.textContent = "Nao foi possivel gerar a predicao.";
    statusMessage.textContent = error.message;
    statusMessage.classList.add("error");
  }
});
