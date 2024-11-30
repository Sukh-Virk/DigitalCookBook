const apiKey = "1d3658f299d5432c910aad2df2ca8f71";

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function handleDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedItem = document.getElementById(data);

    if (draggedItem) {
        const targetDay = event.target.closest(".day");
        if (targetDay) {
            const targetUl = targetDay.querySelector("ul");
            if (targetUl) {
                // Avoid duplicating remove buttons
                const existingRemoveBtn = draggedItem.querySelector(".remove-btn");
                if (!existingRemoveBtn) {
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "Remove";
                    removeBtn.classList.add("remove-btn");
                    removeBtn.addEventListener("click", () => removeMeal(draggedItem, draggedItem.id));
                    draggedItem.appendChild(removeBtn);
                }

                targetUl.appendChild(draggedItem);
            }
        }
    }
}

function removeMeal(mealItem, mealId) {
    mealItem.remove();

    const savedPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
    Object.keys(savedPlan).forEach((day) => {
        savedPlan[day] = savedPlan[day].filter((meal) => meal.id !== mealId);
    });

    localStorage.setItem("mealPlan", JSON.stringify(savedPlan));
    addMealBackToSearch(mealItem);
}

function addMealBackToSearch(mealItem) {
    const resultsList = document.getElementById("search-results");

    if (!resultsList) {
        console.error("Search results container not found!");
        return;
    }

    const image = mealItem.querySelector("img")?.src;
    const title = mealItem.querySelector("span")?.textContent;

    if (!image || !title) {
        console.error("Meal item is missing required data (image or title)");
        return;
    }

    const listItem = document.createElement("li");
    listItem.id = mealItem.id;
    listItem.setAttribute("draggable", "true");
    listItem.addEventListener("dragstart", drag);

    const mealImage = document.createElement("img");
    mealImage.src = image;
    mealImage.alt = title;

    const mealTitle = document.createElement("span");
    mealTitle.textContent = title;

    listItem.appendChild(mealImage);
    listItem.appendChild(mealTitle);
    resultsList.appendChild(listItem);
}

function searchMeals(e) {
    e.preventDefault();

    const query = document.getElementById("meal-search")?.value.trim();
    if (!query) return;

    const resultsList = document.getElementById("search-results");
    if (!resultsList) {
        console.error("Search results container not found!");
        return;
    }

    resultsList.innerHTML = "<li>Loading...</li>";

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) throw new Error("API request failed");
            return response.json();
        })
        .then((data) => {
            resultsList.innerHTML = "";

            if (data.results && data.results.length > 0) {
                data.results.forEach((recipe) => {
                    const listItem = document.createElement("li");
                    listItem.id = `recipe-${recipe.id}`;
                    listItem.setAttribute("draggable", "true");
                    listItem.addEventListener("dragstart", drag);

                    const image = document.createElement("img");
                    image.src = recipe.image;
                    image.alt = recipe.title;

                    const title = document.createElement("span");
                    title.textContent = recipe.title;

                    listItem.appendChild(image);
                    listItem.appendChild(title);
                    resultsList.appendChild(listItem);
                });
            } else {
                resultsList.innerHTML = "<li>No results found. Try a different query.</li>";
            }
        })
        .catch((error) => {
            resultsList.innerHTML = "<li>Error fetching recipes. Please try again.</li>";
            console.error("Error fetching recipes:", error);
        });
}

function initializeMealPlanEvents() {
    document.querySelectorAll(".day").forEach((day) => {
        day.addEventListener("dragover", allowDrop);
        day.addEventListener("drop", handleDrop);
    });

    const mealForm = document.getElementById("meal-form");
    if (mealForm) {
        mealForm.addEventListener("submit", searchMeals);
    }

    const savePlanButton = document.getElementById("save-plan");
    if (savePlanButton) {
        savePlanButton.addEventListener("click", () => {
            const plan = {};

            document.querySelectorAll(".day").forEach((day) => {
                const dayName = day.id;
                const meals = Array.from(day.querySelectorAll("li")).map((li) => ({
                    id: li.id,
                    title: li.querySelector("span").textContent,
                    image: li.querySelector("img").src,
                }));
                plan[dayName] = meals;
            });

            localStorage.setItem("mealPlan", JSON.stringify(plan));
            alert("Meal plan saved!");
        });
    }
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        initializeMealPlanEvents();

        const savedPlan = JSON.parse(localStorage.getItem("mealPlan"));
        if (savedPlan) {
            Object.keys(savedPlan).forEach((day) => {
                const dayUl = document.getElementById(day)?.querySelector("ul");
                if (dayUl) {
                    savedPlan[day].forEach((meal) => {
                        const listItem = document.createElement("li");
                        listItem.id = meal.id;
                        listItem.setAttribute("draggable", "true");
                        listItem.addEventListener("dragstart", drag);

                        const image = document.createElement("img");
                        image.src = meal.image;
                        image.alt = meal.title;

                        const title = document.createElement("span");
                        title.textContent = meal.title;

                        const removeBtn = document.createElement("button");
                        removeBtn.textContent = "Remove";
                        removeBtn.classList.add("remove-btn");
                        removeBtn.addEventListener("click", () => removeMeal(listItem, meal.id));

                        listItem.appendChild(image);
                        listItem.appendChild(title);
                        listItem.appendChild(removeBtn);
                        dayUl.appendChild(listItem);
                    });
                }
            });
        }
    });
}
