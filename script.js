let role = "";
let allQuestions = [
    { question: "Which country won the ICC Men's Cricket World Cup 2023?", options: ["India", "Australia", "England", "New Zealand"], correct: 2 },
    { question: "What is the highest individual score in Test cricket?", options: ["400*", "375", "334", "501*"], correct: 1 },
    { question: "Which cricket term refers to a batsman being dismissed without scoring any runs?", options: ["Leg Before Wicket", "Duck", "Maiden Over", "Stumped"], correct: 2 },
    { question: "How many players are there in a cricket team on the field?", options: ["10", "11", "12", "9"], correct: 2 },
    { question: "Which bowler has taken the most wickets in international cricket (all formats combined)?", options: ["Shane Warne", "James Anderson", "Muttiah Muralitharan", "Anil Kumble"], correct: 3 },
    { question: "What is the maximum width of a cricket bat allowed by the laws?", options: ["4.25 inches", "5.5 inches", "6 inches", "4 inches"], correct: 1 },
    { question: "Which player has scored the most centuries in international cricket?", options: ["Ricky Ponting", "Virat Kohli", "Sachin Tendulkar", "Kumar Sangakkara"], correct: 3 },
    { question: "What does LBW stand for in cricket?", options: ["Long Ball Wide", "Leg Before Wicket", "Lofted Batting Wicket", "Lower Batting Window"], correct: 2 },
    { question: "Which country has won the most ICC Men's Cricket World Cups?", options: ["India", "West Indies", "England", "Australia"], correct: 4 },
    { question: "What is the name of the trophy awarded to the winner of a Test series between England and Australia?", options: ["The Ashes", "World Cup", "Champions Trophy", "ICC Trophy"], correct: 1 },
    { question: "How many runs are scored for hitting the ball over the boundary without it touching the ground?", options: ["4", "6", "2", "1"], correct: 2 },
    { question: "Which cricket format is typically played over a single day with each team getting 50 overs?", options: ["Test Cricket", "Twenty20", "One Day International", "First-class Cricket"], correct: 3 },
    { question: "Which Indian cricketer is nicknamed 'The Wall'?", options: ["Sachin Tendulkar", "MS Dhoni", "Rahul Dravid", "Virat Kohli"], correct: 3 },
    { question: "How many balls are in an over in standard international cricket?", options: ["4", "6", "8", "5"], correct: 2 },
    { question: "Which cricketer holds the record for most sixes in international cricket?", options: ["Chris Gayle", "Shahid Afridi", "MS Dhoni", "Rohit Sharma"], correct: 1 }
];

let selectedQuestions = JSON.parse(localStorage.getItem("selectedQuestions")) || [];
let currentQuestion = 0;
let score = 0;
let answerSelected = false;
let incorrectAnswers = 0;

function setRole(selectedRole) {
    role = selectedRole;
    document.querySelector(".role-selection").classList.add("hidden");
    if (role === "admin") {
        document.querySelector(".admin-box").classList.remove("hidden");
        loadQuestionSelection();
    } else {
        if (selectedQuestions.length === 0) {
            alert("No questions have been selected by the admin yet.");
            location.reload();
        } else {
            document.querySelector(".quiz-box").classList.remove("hidden");
            showQuestion();
        }
    }
}

function returnToMainMenu() {
    // Hide all interfaces
    document.querySelector(".admin-box").classList.add("hidden");
    document.querySelector(".quiz-box").classList.add("hidden");

    // Show role selection
    document.querySelector(".role-selection").classList.remove("hidden");

    // Reset quiz data
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = 0;
    answerSelected = false;

    // Reset the quiz UI for next time
    document.getElementById("result-container").classList.add("hidden");
    document.querySelector(".question-box").classList.remove("hidden");
}

function loadQuestionSelection() {
    const form = document.getElementById("question-selection-form");
    form.innerHTML = "";
    allQuestions.forEach((q, index) => {
        const isSelected = selectedQuestions.find(sel => sel.question === q.question);

        const wrapper = document.createElement("div");
        wrapper.className = "checkbox-wrapper";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `q${index}`;
        checkbox.value = index;
        checkbox.checked = isSelected;

        const label = document.createElement("label");
        label.htmlFor = `q${index}`;
        label.innerText = q.question;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        form.appendChild(wrapper);
    });
}

function resetSelection() {
    document.querySelectorAll("#question-selection-form input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    });

    const adminMsg = document.getElementById("admin-msg");
    adminMsg.textContent = "Selection reset. Please select questions.";
    adminMsg.classList.remove("hidden");
    setTimeout(() => adminMsg.classList.add("hidden"), 3000);
}

function confirmSelection() {
    const checked = Array.from(document.querySelectorAll("#question-selection-form input:checked"));
    const adminMsg = document.getElementById("admin-msg");

    if (checked.length === 0) {
        adminMsg.textContent = "Please select at least one question.";
        adminMsg.classList.remove("hidden");
        setTimeout(() => adminMsg.classList.add("hidden"), 3000);
        return;
    }

    selectedQuestions = checked.map(input => allQuestions[parseInt(input.value)]);
    localStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions));

    adminMsg.textContent = `${selectedQuestions.length} question(s) selected! Users can now take the quiz.`;
    adminMsg.classList.remove("hidden");

    // Return to main menu after 2 seconds
    setTimeout(() => {
        returnToMainMenu();
    }, 2000);
}

function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = ((currentQuestion + 1) / selectedQuestions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function showQuestion() {
    answerSelected = false;
    updateProgressBar();

    const q = selectedQuestions[currentQuestion];
    const questionElement = document.getElementById("quiz-question");
    questionElement.textContent = q.question;
    questionElement.className = "animate__animated animate__fadeIn";

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.className = "option-button animate__animated animate__fadeIn";
        btn.style.animationDelay = `${index * 0.1}s`;

        const optionIcon = document.createElement("span");
        optionIcon.className = "option-icon";
        optionIcon.textContent = String.fromCharCode(65 + index); // A, B, C, D...

        const optionText = document.createElement("span");
        optionText.className = "option-text";
        optionText.textContent = opt;

        btn.appendChild(optionIcon);
        btn.appendChild(optionText);
        btn.onclick = () => checkAnswer(btn, index + 1);

        optionsDiv.appendChild(btn);
    });

    document.getElementById("next-btn").innerHTML = currentQuestion === selectedQuestions.length - 1
        ? '<i class="fas fa-flag-checkered"></i> Finish Quiz'
        : '<i class="fas fa-arrow-right"></i> Next Question';
}

function checkAnswer(button, selected) {
    if (answerSelected) return;

    answerSelected = true;
    const correct = selectedQuestions[currentQuestion].correct;

    document.querySelectorAll(".option-button").forEach(btn => {
        btn.disabled = true;
        const btnIndex = Array.from(btn.parentNode.children).indexOf(btn) + 1;

        if (btnIndex === correct) {
            btn.classList.add("correct");
        } else if (btnIndex === selected && selected !== correct) {
            btn.classList.add("incorrect");
        }
    });

    if (selected === correct) {
        score++;
        button.classList.add("selected", "correct");
        createConfetti();
    } else {
        button.classList.add("selected", "incorrect");
        incorrectAnswers++;
    }
}

function createConfetti() {
    const container = document.querySelector(".container");
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = confetti.style.width;

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function nextQuestion() {
    if (!answerSelected && currentQuestion < selectedQuestions.length) {
        const confirmSkip = confirm("You haven't selected an answer. Are you sure you want to skip this question?");
        if (!confirmSkip) return;
        incorrectAnswers++;
    }

    currentQuestion++;
    if (currentQuestion < selectedQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.querySelector(".question-box").classList.add("hidden");
    document.getElementById("result-container").classList.remove("hidden");

    const correctCount = document.getElementById("correct-count");
    const incorrectCount = document.getElementById("incorrect-count");
    const percentElement = document.getElementById("percent");
    const resultElement = document.getElementById("result");

    correctCount.textContent = score;
    incorrectCount.textContent = incorrectAnswers;

    const percentage = Math.round((score / selectedQuestions.length) * 100);
    percentElement.textContent = `${percentage}%`;

    let message;
    if (percentage >= 90) {
        message = "🏆 Outstanding! You're a cricket expert!";
    } else if (percentage >= 70) {
        message = "🎉 Great job! You really know your cricket!";
    } else if (percentage >= 50) {
        message = "👍 Good effort! You've got decent cricket knowledge!";
    } else {
        message = "🤔 Keep practicing! There's more to learn about cricket!";
    }

    resultElement.innerHTML = `${message}<br>Your Score: ${score}/${selectedQuestions.length}`;

    if (percentage >= 70) {
        createConfetti();
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = 0;
    document.getElementById("result-container").classList.add("hidden");
    document.querySelector(".question-box").classList.remove("hidden");
    showQuestion();
}