// ===============================
// تاریخ امروز
// ===============================

const dateElement = document.getElementById("date");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});


// ===============================
// عناصر صفحه
// ===============================

const habitsSection = document.querySelector(".habits-section");
const addButton = document.querySelector(".add-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");


// ===============================
// اطلاعات ذخیره شده
// ===============================

let habits = JSON.parse(
    localStorage.getItem("habits")
) || [
    {
        name: "JavaScript",
        icon: "💻",
        streak: 0,
        lastCompleted: null
    },
    {
        name: "English",
        icon: "📚",
        streak: 0,
        lastCompleted: null
    },
    {
        name: "Exercise",
        icon: "🏃",
        streak: 0,
        lastCompleted: null
    }
];


// ===============================
// تبدیل تاریخ
// ===============================

function getDateString(date) {
    return date.toISOString().split("T")[0];
}


const todayString = getDateString(new Date());


// ===============================
// بررسی Streak
// ===============================

function checkStreak(habit) {

    if (!habit.lastCompleted) {
        return;
    }

    const today = new Date();

    const lastDate = new Date(habit.lastCompleted);

    const difference = Math.floor(
        (today - lastDate) /
        (1000 * 60 * 60 * 24)
    );

    if (difference > 1) {
        habit.streak = 0;
        habit.lastCompleted = null;
    }
}


// ===============================
// نمایش عادت‌ها
// ===============================

function displayHabits() {

    habitsSection.innerHTML = "";

    habits.forEach(function(habit, index) {

        checkStreak(habit);

        const habitElement = document.createElement("div");

        habitElement.classList.add("habit");

        const completedToday =
            habit.lastCompleted === todayString;


        if (completedToday) {
            habitElement.classList.add("completed");
        }


        habitElement.innerHTML = `

            <div>
                <h3>
                    ${habit.icon} ${habit.name}
                </h3>

                <p>
                    🔥 ${habit.streak} day streak
                </p>
            </div>

            <div>

                <button class="done-btn">
                    ${completedToday ? "✓ Completed" : "✓ Done"}
                </button>

                <button class="edit-btn">
                    ✏️
                </button>

                <button class="delete-btn">
                    🗑️
                </button>

            </div>

        `;


        const doneButton =
            habitElement.querySelector(".done-btn");

        const editButton =
            habitElement.querySelector(".edit-btn");

        const deleteButton =
            habitElement.querySelector(".delete-btn");


        // ===============================
        // رنگ دکمه Completed
        // ===============================

        if (completedToday) {
            doneButton.style.background = "#16a34a";
        }


        // ===============================
        // Done
        // ===============================

        doneButton.addEventListener(
            "click",
            function() {

                const currentDate =
                    getDateString(new Date());


                if (
                    habit.lastCompleted ===
                    currentDate
                ) {

                    habit.lastCompleted = null;

                    habit.streak--;

                    if (habit.streak < 0) {
                        habit.streak = 0;
                    }

                }

                else {

                    const yesterday =
                        new Date();






yesterday.setDate(
                        yesterday.getDate() - 1
                    );


                    const yesterdayString =
                        getDateString(yesterday);


                    if (
                        habit.lastCompleted ===
                        yesterdayString
                    ) {

                        habit.streak++;

                    }

                    else {

                        habit.streak = 1;

                    }


                    habit.lastCompleted =
                        currentDate;
                }


                saveHabits();

                displayHabits();

            }
        );


        // ===============================
        // ویرایش عادت
        // ===============================

        editButton.addEventListener(
            "click",
            function() {

                const newName =
                    prompt(
                        "Enter new habit name:",
                        habit.name
                    );


                if (
                    newName === null ||
                    newName.trim() === ""
                ) {
                    return;
                }


                habit.name =
                    newName.trim();


                saveHabits();

                displayHabits();

            }
        );


        // ===============================
        // حذف عادت
        // ===============================

        deleteButton.addEventListener(
            "click",
            function() {

                const confirmDelete =
                    confirm(
                        `Delete "${habit.name}"?`
                    );


                if (!confirmDelete) {
                    return;
                }


                habits.splice(index, 1);


                saveHabits();

                displayHabits();

            }
        );


        habitsSection.appendChild(
            habitElement
        );

    });


    updateProgress();
}


// ===============================
// اضافه کردن عادت
// ===============================

addButton.addEventListener(
    "click",
    function() {

        const habitName =
            prompt(
                "Enter your new habit:"
            );


        if (
            habitName === null ||
            habitName.trim() === ""
        ) {
            return;
        }


        // انتخاب آیکون

        const icon =
            prompt(
                "Choose an icon:\n\n" +
                "💻 📚 🏃 🏋️ 🎯 💧 📖 🧘 🎸 🎮"
            );


        habits.push({

            name: habitName.trim(),

            icon:
                icon && icon.trim()
                ? icon.trim()
                : "🎯",

            streak: 0,

            lastCompleted: null

        });


        saveHabits();

        displayHabits();

    }
);


// ===============================
// ذخیره اطلاعات
// ===============================

function saveHabits() {

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );

}


// ===============================
// درصد پیشرفت
// ===============================

function updateProgress() {

    const total =
        habits.length;


    const completed =
        habits.filter(
            function(habit) {

                return (
                    habit.lastCompleted ===
                    todayString
                );

            }
        ).length;


    if (total === 0) {

        progressBar.style.width = "0%";

        progressText.textContent =
            "0% Complete";

        return;
    }


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    progressBar.style.width =
        percentage + "%";


    progressText.textContent =
        percentage + "% Complete";

}


// ===============================
// شروع برنامه
// ===============================

displayHabits();