/**
 * UI Controller and Main Application State
 */
document.addEventListener("DOMContentLoaded", () => {
  const state = {
    score: 0,
    totalAttempted: 0,
    currentProblem: null,
    topic: "all",
    difficulty: "medium",
    mode: "practice"
  };

  // DOM Elements
  const problemCategoryBadge = document.getElementById("problem-category-badge");
  const problemDifficultyBadge = document.getElementById("problem-difficulty-badge");
  const problemPrompt = document.getElementById("problem-prompt");
  const mathExpression = document.getElementById("math-expression");
  const inputContainer = document.getElementById("input-container");
  const feedbackBanner = document.getElementById("feedback-banner");
  
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const resetBtn = document.getElementById("reset-btn");

  const scoreDisplay = document.getElementById("score-display");
  const accuracyDisplay = document.getElementById("accuracy-display");

  // Selectors
  const topicSelect = document.getElementById("topic-select");
  const difficultySelect = document.getElementById("difficulty-select");
  const modeSelect = document.getElementById("mode-select");

  // Load new problem and render UI
  function loadProblem() {
    feedbackBanner.classList.add("hidden");
    submitBtn.classList.remove("hidden");
    nextBtn.classList.add("hidden");

    state.currentProblem = ProblemGenerator.generate(state.topic, state.difficulty);
    const p = state.currentProblem;

    // Set badges
    problemCategoryBadge.innerText = p.category;
    problemDifficultyBadge.innerText = state.difficulty.toUpperCase();
    problemDifficultyBadge.className = `badge difficulty-${state.difficulty}`;

    problemPrompt.innerText = p.prompt;

    // Render LaTeX Math using KaTeX
    katex.render(p.latex, mathExpression, { throwOnError: false });

    // Render Input Fields based on problem type
    renderInputFields(p);
  }

  function renderInputFields(problem) {
    inputContainer.innerHTML = "";

    if (problem.type === "checkbox") {
      const group = document.createElement("div");
      group.className = "checkbox-group";
      problem.options.forEach(opt => {
        group.innerHTML += `
          <label>
            <input type="checkbox" name="sets" value="${opt}"> ${opt}
          </label>
        `;
      });
      inputContainer.appendChild(group);

    } else if (problem.type === "numeric") {
      inputContainer.innerHTML = `<input type="number" step="any" id="user-numeric-input" placeholder="Enter answer">`;

    } else if (problem.type === "inequality_input") {
      inputContainer.innerHTML = `
        <span>x</span>
        <select id="user-op-input">
          <option value="<">&lt;</option>
          <option value="\le">&le;</option>
          <option value=">">&gt;</option>
          <option value="\ge">&ge;</option>
        </select>
        <input type="number" step="any" id="user-val-input" placeholder="Value">
      `;
    }
  }

  function getUserInput() {
    const p = state.currentProblem;
    if (p.type === "checkbox") {
      const checked = Array.from(document.querySelectorAll('input[name="sets"]:checked'));
      return checked.map(el => el.value);
    } else if (p.type === "numeric") {
      return document.getElementById("user-numeric-input").value;
    } else if (p.type === "inequality_input") {
      return {
        operator: document.getElementById("user-op-input").value,
        value: document.getElementById("user-val-input").value
      };
    }
    return null;
  }

  // Handle Answer Submission
  submitBtn.addEventListener("click", () => {
    const userInput = getUserInput();
    const isCorrect = AnswerEvaluator.evaluate(state.currentProblem, userInput);

    state.totalAttempted++;
    if (isCorrect) state.score++;

    updateScoreboard();

    // Show Feedback Banner
    feedbackBanner.classList.remove("hidden", "correct", "incorrect");
    if (isCorrect) {
      feedbackBanner.classList.add("correct");
      feedbackBanner.innerText = "Correct! Great job.";
    } else {
      feedbackBanner.classList.add("incorrect");
      feedbackBanner.innerText = "Incorrect. Try again or go to the next question.";
    }

    submitBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
  });

  nextBtn.addEventListener("click", loadProblem);

  function updateScoreboard() {
    scoreDisplay.innerText = `${state.score} / ${state.totalAttempted}`;
    const acc = state.totalAttempted === 0 ? 0 : Math.round((state.score / state.totalAttempted) * 100);
    accuracyDisplay.innerText = `${acc}%`;
  }

  // Listeners for Controls
  topicSelect.addEventListener("change", (e) => { state.topic = e.target.value; loadProblem(); });
  difficultySelect.addEventListener("change", (e) => { state.difficulty = e.target.value; loadProblem(); });

  resetBtn.addEventListener("click", () => {
    state.score = 0;
    state.totalAttempted = 0;
    updateScoreboard();
    loadProblem();
  });

  // Initialize
  loadProblem();
});
