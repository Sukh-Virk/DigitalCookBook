const apiKey = "0f95ca855ef747688a8c3fa3c16aac69";

// Drag-and-Drop Functions
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggedItem = document.getElementById(data);

  if (draggedItem) {
    const targetUl = event.target.closest(".day").querySelector("ul");
    targetUl.appendChild(draggedItem);
    // After adding to planner, add remove button to the item
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => removeMeal(draggedItem, draggedItem.id));
    draggedItem.appendChild(removeBtn);
  }
}

// Add visual feedback for drag-and-drop
document.querySelectorAll(".day").forEach((day) => {
  day.addEventListener("dragover", (e) => day.classList.add("drag-over"));
  day.addEventListener("dragleave", (e) => day.classList.remove("drag-over"));
  day.addEventListener("drop", (e) => day.classList.remove("drag-over"));
});

// Search Meals
document.getElementById("meal-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const query = document.getElementById("meal-search").value.trim();
  if (!query) return;

  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const resultsList = document.getElementById("search-results");
      resultsList.innerHTML = ""; // Clear previous results

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

          // No "Add to Planner" button needed, just make it draggable

          listItem.appendChild(image);
          listItem.appendChild(title);
          resultsList.appendChild(listItem);
        });
      } else {
        resultsList.innerHTML = "<li>No results found.</li>";
      }
    })
    .catch((error) => console.error("Error fetching recipes:", error));
});

// Remove Meal from Day and Update Plan
function removeMeal(mealItem, mealId) {
  // Remove meal from the day
  mealItem.remove();

  // Remove meal from the localStorage
  const savedPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
  Object.keys(savedPlan).forEach((day) => {
    savedPlan[day] = savedPlan[day].filter(meal => meal.id !== mealId);
  });

  localStorage.setItem("mealPlan", JSON.stringify(savedPlan));

  // Add the meal back to the search results
  addMealBackToSearch(mealItem);
}

// Add Meal Back to Search Results
function addMealBackToSearch(mealItem) {
  const resultsList = document.getElementById("search-results");

  const image = mealItem.querySelector("img").src;
  const title = mealItem.querySelector("span").textContent;

  const listItem = document.createElement("li");
  listItem.id = mealItem.id;
  const mealImage = document.createElement("img");
  mealImage.src = image;
  mealImage.alt = title;

  const mealTitle = document.createElement("span");
  mealTitle.textContent = title;

  listItem.appendChild(mealImage);
  listItem.appendChild(mealTitle);
  resultsList.appendChild(listItem);
}

// Save Plan
document.getElementById("save-plan").addEventListener("click", () => {
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

// Load Plan on Page Load
document.addEventListener("DOMContentLoaded", () => {
  const savedPlan = JSON.parse(localStorage.getItem("mealPlan"));
  if (savedPlan) {
    Object.keys(savedPlan).forEach((day) => {
      const dayUl = document.getElementById(day).querySelector("ul");
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

        // Create remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", () => removeMeal(listItem, meal.id));

        listItem.appendChild(image);
        listItem.appendChild(title);
        listItem.appendChild(removeBtn);
        dayUl.appendChild(listItem);
      });
    });
  }
});