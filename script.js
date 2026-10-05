/* =========================================
   MINDSCAPE
   Main JavaScript
========================================= */


/* =========================================
   1. SELECT ELEMENTS
========================================= */

const addGoalBtn = document.getElementById("addGoalBtn");
const closeModal = document.getElementById("closeModal");

const goalModal = document.getElementById("goalModal");
const goalForm = document.getElementById("goalForm");

const goalName = document.getElementById("goalName");
const goalDescription = document.getElementById("goalDescription");
const goalProgress = document.getElementById("goalProgress");

const goalGrid = document.querySelector(".goal-grid");

const goalCount = document.getElementById("goalCount");
const progressValue = document.getElementById("progressValue");

const focusBtn = document.getElementById("focusBtn");
const timerMinutes = document.getElementById("timerMinutes");

const themeBtn = document.getElementById("themeBtn");


/* =========================================
   2. DEFAULT GOALS
========================================= */

let goals = JSON.parse(localStorage.getItem("mindscapeGoals")) || [
    {
        name: "JavaScript",
        description: "Build real-world projects and improve programming logic.",
        progress: 65,
        tasks: "13 / 20",
        symbol: "JS"
    },

    {
        name: "English C1",
        description: "Improve vocabulary, grammar, speaking and listening.",
        progress: 42,
        tasks: "8 / 19",
        symbol: "EN"
    },

    {
        name: "Portfolio",
        description: "Create powerful projects for your developer portfolio.",
        progress: 78,
        tasks: "18 / 23",
        symbol: "PF"
    },

    {
        name: "Career",
        description: "Prepare your skills and applications for the future.",
        progress: 34,
        tasks: "6 / 18",
        symbol: "CR"
    }
];


/* =========================================
   3. SAVE DATA
========================================= */

function saveGoals() {

    localStorage.setItem(
        "mindscapeGoals",
        JSON.stringify(goals)
    );

}


/* =========================================
   4. UPDATE STATISTICS
========================================= */

function updateStats() {

    /*
        Number of goals
    */

    goalCount.textContent =
        String(goals.length).padStart(2, "0");


    /*
        Calculate average progress
    */

    if (goals.length === 0) {

        progressValue.textContent = "0%";

        return;
    }


    let totalProgress = 0;


    goals.forEach(function(goal) {

        totalProgress += Number(goal.progress);

    });


    const average =
        Math.round(totalProgress / goals.length);


    progressValue.textContent =
        average + "%";

}


/* =========================================
   5. CREATE GOAL CARD
========================================= */

function createGoalCard(goal, index) {

    const card = document.createElement("article");

    card.classList.add("goal-card");


    card.innerHTML = `

        <div class="goal-card-top">

            <div class="goal-symbol">
                ${goal.symbol}
            </div>

            <span class="percentage">
                ${goal.progress}%
            </span>

        </div>


        <h3>
            ${goal.name}
        </h3>


        <p>
            ${goal.description}
        </p>


        <div class="progress">

            <div
                class="progress-bar"
                style="width:${goal.progress}%">
            </div>

        </div>


        <div class="goal-footer">

            <span>
                ${goal.tasks || "0 / 0"} tasks
            </span>

            <button
                class="goal-action"
                data-index="${index}">

                →

            </button>

        </div>

    `;


    goalGrid.appendChild(card);

}


/* =========================================
   6. DISPLAY ALL GOALS
========================================= */

function renderGoals() {

    /*Remove old cards
    */

    goalGrid.innerHTML = "";


    /*
        Create cards again
    */

    goals.forEach(function(goal, index) {

        createGoalCard(goal, index);

    });


    updateStats();

}


/* =========================================
   7. OPEN MODAL
========================================= */

addGoalBtn.addEventListener("click", function() {

    goalModal.classList.add("active");

});


/* =========================================
   8. CLOSE MODAL
========================================= */

closeModal.addEventListener("click", function() {

    goalModal.classList.remove("active");

});


/* =========================================
   9. CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

goalModal.addEventListener("click", function(event) {

    if (event.target === goalModal) {

        goalModal.classList.remove("active");

    }

});


/* =========================================
   10. CREATE NEW GOAL
========================================= */

goalForm.addEventListener("submit", function(event) {

    /*
        Stop page refresh
    */

    event.preventDefault();


    /*
        Get user information
    */

    const name =
        goalName.value.trim();

    const description =
        goalDescription.value.trim();

    const progress =
        Number(goalProgress.value);


    /*
        Check name
    */

    if (name === "") {

        alert("Please enter a goal name.");

        return;

    }


    /*
        Create symbol
    */

    const symbol =
        name.substring(0, 2).toUpperCase();


    /*
        Create new object
    */

    const newGoal = {

        name: name,

        description:
            description || "No description.",

        progress:
            Math.min(Math.max(progress, 0), 100),

        tasks:
            "0 / 0",

        symbol:
            symbol

    };


    /*
        Add goal to array
    */

    goals.push(newGoal);


    /*
        Save to localStorage
    */

    saveGoals();


    /*
        Update screen
    */

    renderGoals();


    /*
        Reset form
    */

    goalForm.reset();


    /*
        Close modal
    */

    goalModal.classList.remove("active");


});


/* =========================================
   11. GOAL ACTION BUTTON
========================================= */

goalGrid.addEventListener("click", function(event) {

    const button =
        event.target.closest(".goal-action");


    if (!button) {

        return;

    }


    const index =
        Number(button.dataset.index);


    /*
        Increase progress
    */

    if (goals[index]) {

        goals[index].progress += 5;


        /*
            Maximum = 100
        */

        if (goals[index].progress > 100) {

            goals[index].progress = 100;

        }


        saveGoals();

        renderGoals();

    }

});


/* =========================================
   12. FOCUS TIMER
========================================= */

let focusSeconds = 25 * 60;

let timerRunning = false;

let timerInterval = null;


/* =========================================
   13. FORMAT TIMER
========================================= */

function updateTimer() {

    const minutes =
        Math.floor(focusSeconds / 60);

    const seconds =
        focusSeconds % 60;


    /*
        Show minutes
    */

    timerMinutes.textContent =
        String(minutes).padStart(2, "0");


    /*
        Change button
    */

    if (timerRunning) {

        focusBtn.innerHTML =
            "Pause Focus";

    }

    else {

        focusBtn.innerHTML =
            "Start Focus <span>→</span>";

    }

}


/* =========================================
   14. START / PAUSE TIMER
========================================= */

focusBtn.addEventListener("click", function() {

    /*
        If timer is running
        pause it
    */

    if (timerRunning) {

        clearInterval(timerInterval);

        timerRunning = false;

        updateTimer();

        return;

    }


    /*
        Start timer
    */

    timerRunning = true;timerInterval = setInterval(function() {

        focusSeconds--;


        updateTimer();


        /*
            Timer finished
        */

        if (focusSeconds <= 0) {

            clearInterval(timerInterval);

            timerRunning = false;

            alert("🎉 Focus session complete!");

            focusSeconds = 25 * 60;

            updateTimer();

        }

    }, 1000);

});


/* =========================================
   15. THEME
========================================= */

let lightMode =
    localStorage.getItem("mindscapeTheme") === "light";


function applyTheme() {

    if (lightMode) {

        document.body.style.background =
            "#f4f4f7";

        document.body.style.color =
            "#111117";

        themeBtn.textContent = "☀";

    }

    else {

        document.body.style.background =
            "#09090d";

        document.body.style.color =
            "#f5f5f7";

        themeBtn.textContent = "◐";

    }

}


themeBtn.addEventListener("click", function() {

    lightMode = !lightMode;


    localStorage.setItem(
        "mindscapeTheme",
        lightMode ? "light" : "dark"
    );


    applyTheme();

});


/* =========================================
   16. INITIALIZE APP
========================================= */

renderGoals();

updateTimer();

applyTheme();