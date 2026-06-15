const isBackendOrigin = ["127.0.0.1:8000", "localhost:8000"].includes(window.location.host);
const API_URL = isBackendOrigin ? "/predict" : "http://127.0.0.1:8000/predict";

const form = document.querySelector("#prediction-form");
const gpaValue = document.querySelector("#gpa-value");
const interpretation = document.querySelector("#interpretation");
const statusMessage = document.querySelector("#status-message");
const resultExplanation = document.querySelector("#result-explanation");
const explanationSummary = document.querySelector("#explanation-summary");
const positiveFactors = document.querySelector("#positive-factors");
const attentionFactors = document.querySelector("#attention-factors");

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

function getInterpretation(gpa) {
  if (gpa >= 3.5) {
    return "Alto desempenho previsto";
  }

  if (gpa >= 2.5) {
    return "Desempenho intermediário previsto";
  }

  return "Atenção: desempenho previsto abaixo do ideal";
}

function getResultSummary(gpa, input) {
  const variation = gpa - input.Pre_Semester_GPA;
  const direction = variation >= 0 ? "acima" : "abaixo";
  const difference = Math.abs(variation).toFixed(2);

  if (difference === "0.00") {
    return "A previsão ficou praticamente igual ao GPA anterior, indicando estabilidade no desempenho estimado.";
  }

  return `A previsão ficou ${difference} ponto(s) ${direction} do GPA anterior, considerando o perfil informado e os padrões aprendidos pelo modelo.`;
}

function addFactor(list, text) {
  if (list.length < 4) {
    list.push(text);
  }
}

function getExplanatoryFactors(input, predictedGpa) {
  const positives = [];
  const attentions = [];

  if (input.Pre_Semester_GPA >= 3.4) {
    addFactor(positives, "GPA anterior alto, indicando bom histórico acadêmico.");
  } else if (input.Pre_Semester_GPA < 2.5) {
    addFactor(attentions, "GPA anterior baixo, que pode limitar a previsão final.");
  }

  if (input.Traditional_Study_Hours >= 14) {
    addFactor(positives, "Boa carga de estudo tradicional semanal.");
  } else if (input.Traditional_Study_Hours < 8) {
    addFactor(attentions, "Poucas horas de estudo tradicional informadas.");
  }

  if (input.Skill_Retention_Score >= 75) {
    addFactor(positives, "Retenção de habilidades em nível favorável.");
  } else if (input.Skill_Retention_Score < 60) {
    addFactor(attentions, "Retenção de habilidades abaixo do ideal.");
  }

  if (input.Weekly_GenAI_Hours >= 4 && input.Weekly_GenAI_Hours <= 14) {
    addFactor(positives, "Uso de IA em faixa equilibrada para apoio aos estudos.");
  } else if (input.Weekly_GenAI_Hours > 20) {
    addFactor(attentions, "Uso muito alto de IA, o que pode indicar dependência excessiva.");
  }

  if (input.Prompt_Engineering_Skill === "Advanced") {
    addFactor(positives, "Habilidade avançada em prompts, favorecendo melhor uso da IA.");
  } else if (input.Prompt_Engineering_Skill === "Beginner") {
    addFactor(attentions, "Habilidade inicial em prompts pode reduzir o aproveitamento da IA.");
  }

  if (input.Perceived_AI_Dependency >= 7) {
    addFactor(attentions, "Dependência percebida de IA em nível elevado.");
  }

  if (input.Anxiety_Level_During_Exams >= 7) {
    addFactor(attentions, "Ansiedade em provas elevada, possível fator de queda no desempenho.");
  } else if (input.Anxiety_Level_During_Exams <= 3) {
    addFactor(positives, "Baixo nível de ansiedade em provas.");
  }

  if (input.Burnout_Risk_Level === "Low") {
    addFactor(positives, "Baixo risco de burnout.");
  } else if (input.Burnout_Risk_Level === "High") {
    addFactor(attentions, "Risco alto de burnout informado.");
  }

  if (predictedGpa >= 3.5) {
    addFactor(positives, "Resultado previsto em faixa de alto desempenho.");
  } else if (predictedGpa < 2.5) {
    addFactor(attentions, "Resultado previsto abaixo da faixa intermediária.");
  }

  return {
    positives: positives.length ? positives : ["O modelo encontrou sinais suficientes para estimar o desempenho com estabilidade."],
    attentions: attentions.length ? attentions : ["Nenhum fator crítico se destacou nos dados informados."],
  };
}

function renderList(element, items) {
  element.innerHTML = "";

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  }
}

function updateExplanation(input, predictedGpa) {
  const factors = getExplanatoryFactors(input, predictedGpa);

  explanationSummary.textContent = getResultSummary(predictedGpa, input);
  renderList(positiveFactors, factors.positives);
  renderList(attentionFactors, factors.attentions);
  resultExplanation.hidden = false;
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = buildPayload(new FormData(form));
  statusMessage.textContent = "Enviando dados para o backend...";
  statusMessage.classList.remove("error");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const detail = Array.isArray(error.detail)
        ? error.detail.map((item) => item.msg).join(" ")
        : error.detail;

      throw new Error(detail || `Erro ${response.status} ao chamar o backend.`);
    }

    const result = await response.json();
    const predictedGpa = Number(result.predicted_gpa);

    gpaValue.textContent = predictedGpa.toFixed(2);
    interpretation.textContent = getInterpretation(predictedGpa);
    updateExplanation(payload, predictedGpa);
    statusMessage.textContent = "Predição gerada pelo backend FastAPI.";
  } catch (error) {
    gpaValue.textContent = "--";
    interpretation.textContent = "Não foi possível gerar a predição.";
    resultExplanation.hidden = true;
    statusMessage.textContent = `${error.message} Abra o sistema por http://127.0.0.1:8000/ com o backend rodando.`;
    statusMessage.classList.add("error");
  }
});
