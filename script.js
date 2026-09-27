/* =========================================
   PRODUCT TASK AI
   Frontend Application
========================================= */


/* =========================================
   1. CONFIGURATION
========================================= */

const API_BASE_URL =
  "http://127.0.0.1:5000";


/* =========================================
   2. DOM ELEMENTS
========================================= */

// Input

const problemInput =
  document.querySelector("#problem-description");


// Main actions

const generateButton =
  document.querySelector("#generate-task-button");

const regenerateButton =
  document.querySelector("#regenerate-button");

const copyButton =
  document.querySelector("#copy-task-button");

const newTaskButton =
  document.querySelector("#new-task-button");

const newTaskTooltip =
  document.querySelector("#new-task-tooltip");


// AI status

const statusContainer =
  document.querySelector("#generation-status");

const statusText =
  document.querySelector("#generation-status-text");


// Result states

const resultPanelHeading =
  document.querySelector("#result-panel-heading");

const resultEmptyState =
  document.querySelector("#result-empty-state");

const resultLoadingState =
  document.querySelector("#result-loading-state");

const resultErrorState =
  document.querySelector("#result-error-state");

const resultErrorMessage =
  document.querySelector("#result-error-message");

const retryTaskButton =
  document.querySelector("#retry-task-button");

const taskResult =
  document.querySelector("#task-result");


// Generated task content

const resultTitle =
  document.querySelector("#result-title");

const resultDescription =
  document.querySelector("#result-description");

const resultObjective =
  document.querySelector("#result-objective");

const resultAcceptance =
  document.querySelector("#result-acceptance");


/* =========================================
   3. APPLICATION STATE
========================================= */

let isGenerating = false;

let hasStartedTask = false;


/* =========================================
   4. UI HELPERS
========================================= */

function setStatus(type, text) {

  statusContainer.className =
    `ai-status ai-status-${type}`;

  statusText.textContent = text;

}


function updateGenerateButton() {

  const hasContent =
    problemInput.value.trim().length > 0;

  generateButton.disabled =
    !hasContent || isGenerating;

}


function updateNewTaskButton() {

  newTaskButton.disabled =
    !hasStartedTask;

  newTaskTooltip.classList.toggle(
    "is-disabled",
    !hasStartedTask
  );

}


function setGeneratingState(active) {

  isGenerating = active;


  if (active) {

    generateButton.textContent =
      "Gerando...";

    setStatus(
      "loading",
      "Gerando..."
    );

  } else {

    generateButton.innerHTML = `
      <span
        class="generate-icon"
        aria-hidden="true"
      >
        ✦
      </span>

      Gerar task
    `;

  }


  updateGenerateButton();

}


function showResultState(state) {

  resultPanelHeading.hidden =
    state === "success";


  resultEmptyState.hidden =
    state !== "empty";

  resultLoadingState.hidden =
    state !== "loading";

  resultErrorState.hidden =
    state !== "error";

  taskResult.hidden =
    state !== "success";

}


/* =========================================
   5. RESULT RENDERING
========================================= */

function renderAcceptanceCriteria(criteria) {

  resultAcceptance.innerHTML = "";


  criteria.forEach((criterion) => {

    const listItem =
      document.createElement("li");

    listItem.textContent =
      criterion;

    resultAcceptance.appendChild(
      listItem
    );

  });

}


function displayTask(task) {

  resultTitle.textContent =
    task.title;

  resultDescription.textContent =
    task.description;

  resultObjective.textContent =
    task.objective;


  renderAcceptanceCriteria(
    task.acceptanceCriteria
  );


  showResultState("success");

  updateNewTaskButton();

}


/* =========================================
   6. API
========================================= */

async function requestTask(problem) {

  const response = await fetch(
    `${API_BASE_URL}/generate-task`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        problem
      })
    }
  );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.error ||
      "Não foi possível gerar a task."
    );

  }


  return data.task;

}


async function checkBackend() {

  try {

    const response = await fetch(
      `${API_BASE_URL}/health`
    );


    if (!response.ok) {
      throw new Error();
    }


    const data =
      await response.json();


    console.log(
      "Product Task AI backend:",
      data.status
    );

  } catch (error) {

    console.warn(
      "Backend indisponível."
    );

  }

}


/* =========================================
   7. TASK ACTIONS
========================================= */

async function generateTask() {

  const problem =
    problemInput.value.trim();


  if (!problem || isGenerating) {
    return;
  }


  setGeneratingState(true);

  showResultState("loading");


  try {

    const task =
      await requestTask(problem);


    displayTask(task);


    setStatus(
      "success",
      "Concluído"
    );

  } catch (error) {

    console.error(
      "Erro ao gerar task:",
      error
    );


    resultErrorMessage.textContent =
      "Não conseguimos processar a task. " +
      "Verifique se o backend está disponível " +
      "e tente novamente.";


    showResultState("error");


    setStatus(
      "error",
      "Erro"
    );

  } finally {

    setGeneratingState(false);

  }

}


function resetTask() {

  problemInput.value = "";


  hasStartedTask = false;


  showResultState("empty");


  setStatus(
    "idle",
    "IA pronta"
  );


  updateGenerateButton();

  updateNewTaskButton();


  problemInput.focus();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================
   8. COPY TASK
========================================= */

function buildTaskText() {

  const acceptanceCriteria =
    Array
      .from(
        resultAcceptance.querySelectorAll("li")
      )
      .map(
        item => `- ${item.textContent}`
      )
      .join("\n");


  return `
Título

${resultTitle.textContent}


Descrição

${resultDescription.textContent}


Objetivo

${resultObjective.textContent}


Critérios de aceite

${acceptanceCriteria}
  `.trim();

}


async function copyTask() {

  const taskText =
    buildTaskText();


  try {

    await navigator.clipboard.writeText(
      taskText
    );


    const originalText =
      copyButton.textContent;


    copyButton.textContent =
      "Copiado!";


    setTimeout(() => {

      copyButton.textContent =
        originalText;

    }, 1500);

  } catch (error) {

    console.error(
      "Não foi possível copiar a task:",
      error
    );

  }

}


/* =========================================
   9. EVENT HANDLERS
========================================= */

// Input

problemInput.addEventListener(
  "input",
  () => {

    updateGenerateButton();


    if (
      problemInput.value.trim().length > 0
    ) {

      hasStartedTask = true;

    }


    updateNewTaskButton();

  }
);


// Generate task

generateButton.addEventListener(
  "click",
  generateTask
);


// Generate task again

regenerateButton.addEventListener(
  "click",
  generateTask
);


// Copy task

copyButton.addEventListener(
  "click",
  copyTask
);


// Start a new task

newTaskButton.addEventListener(
  "click",
  resetTask
);


// Retry after error

retryTaskButton.addEventListener(
  "click",
  generateTask
);


/* =========================================
   10. INITIALIZATION
========================================= */

function initializeApp() {

  /*
    If the browser restores text inside the
    textarea after a refresh, consider the
    task already started.
  */

  if (
    problemInput.value.trim().length > 0
  ) {

    hasStartedTask = true;

  }


  updateGenerateButton();

  updateNewTaskButton();


  setStatus(
    "idle",
    "IA pronta"
  );


  checkBackend();

}


initializeApp();