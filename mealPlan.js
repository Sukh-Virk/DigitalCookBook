const apiKey = "1d3658f299d5432c910aad2df2ca8f71";

// Allow drop functionality
function allowDrop(event) {
  event.preventDefault();
}

// Handle dragging an item
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// Handle dropping an item into the planner
function handleDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggedItem = document.getElementById(data);

  if (draggedItem) {
    const targetDay = event.target.closest(".day");
    if (targetDay) {
      const targetUl = targetDay.querySelector("ul");

      // Check if item already exists in planner to avoid duplicates
      if (!Array.from(targetUl.children).some((item) => item.id === draggedItem.id)) {
        // Create a compact item showing only the name and a remove button
        const compactItem = document.createElement("li");
        compactItem.id = draggedItem.id;

        const name = document.createElement("span");
        name.textContent = draggedItem.querySelector("h4").textContent; // Display only name
        compactItem.appendChild(name);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", () => {
          compactItem.remove(); // Remove from the planner
        });

        compactItem.appendChild(removeBtn);
        compactItem.setAttribute("draggable", "true");
        compactItem.addEventListener("dragstart", drag);

        targetUl.appendChild(compactItem);
      }
    }
  }
}

// Save the current meal plan to localStorage
function saveMealPlan() {
  const plan = {};
  document.querySelectorAll(".day").forEach((day) => {
    const dayName = day.id;
    const meals = Array.from(day.querySelectorAll("li")).map((li) => ({
      id: li.id,
      name: li.querySelector("span").textContent,
    }));
    plan[dayName] = meals;
  });

  localStorage.setItem("mealPlan", JSON.stringify(plan));
  alert("Meal plan saved!");
}

// Load the saved meal plan from localStorage
function loadMealPlan() {
  const savedPlan = JSON.parse(localStorage.getItem("mealPlan"));
  if (savedPlan) {
    Object.keys(savedPlan).forEach((day) => {
      const dayUl = document.getElementById(day)?.querySelector("ul");
      if (dayUl) {
        savedPlan[day].forEach((meal) => {
          const listItem = document.createElement("li");
          listItem.id = meal.id;

          const name = document.createElement("span");
          name.textContent = meal.name;

          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Remove";
          removeBtn.classList.add("remove-btn");
          removeBtn.addEventListener("click", () => {
            listItem.remove(); // Remove from the planner
          });

          listItem.appendChild(name);
          listItem.appendChild(removeBtn);
          listItem.setAttribute("draggable", "true");
          listItem.addEventListener("dragstart", drag);

          dayUl.appendChild(listItem);
        });
      }
    });
  }
}

// Show spinner
function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.remove("hidden");
  }
}

// Hide spinner
function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.add("hidden");
  }
}

// Search for meals and display them in the results section
function searchMeals(event) {
  event.preventDefault();

  const query = document.getElementById("meal-search")?.value.trim();
  if (!query) return;

  const resultsList = document.getElementById("search-results");
  resultsList.innerHTML = "";

  // Show spinner during search
  showSpinner();

  // const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&addRecipeInformation=true&apiKey=${apiKey}`;
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&addRecipeInformation=true&addRecipeNutrition=true&apiKey=${apiKey}`;
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("API request failed");
      return response.json();
    })
    .then((data) => {
      hideSpinner(); // Hide spinner after results load
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

          const title = document.createElement("h4");
          title.textContent = recipe.title;

          const servings = document.createElement("p");
          servings.textContent = `Servings: ${recipe.servings || "N/A"}`;

          const prepTime = document.createElement("p");
          prepTime.textContent = `Prep Time: ${recipe.readyInMinutes || "N/A"} mins`;

          let caloriesValue = "N/A";
        if (recipe.nutrition && recipe.nutrition.nutrients) {
          const caloriesInfo = recipe.nutrition.nutrients.find(
            (nutrient) => nutrient.name === "Calories"
          );
          if (caloriesInfo) {
            caloriesValue = `${caloriesInfo.amount} ${caloriesInfo.unit}`;
          }
        }

        const calories = document.createElement("p");
        calories.textContent = `Calories: ${caloriesValue}`;

        let proteinValue = "N/A";
        if (recipe.nutrition && recipe.nutrition.nutrients) {
          const proteinInfo = recipe.nutrition.nutrients.find(
            (nutrient) => nutrient.name === "Protein"
          );
          if (proteinInfo) {
            proteinValue = `${proteinInfo.amount} ${proteinInfo.unit}`;
          }
        }
        const protein = document.createElement("p");
        protein.textContent = `Protein: ${proteinValue}`;
        
          listItem.appendChild(image);
          listItem.appendChild(title);
          listItem.appendChild(servings);
          listItem.appendChild(prepTime);
          listItem.appendChild(calories);
          listItem.appendChild(protein);
          resultsList.appendChild(listItem);
        });
      } else {
        resultsList.innerHTML = "<li>No results found. Try a different query.</li>";
      }
    })
    .catch((error) => {
      hideSpinner(); // Hide spinner on error
      resultsList.innerHTML = "<li>Error fetching recipes. Please try again.</li>";
      console.error("Error fetching recipes:", error);
    });
}

// Auto-scroll functionality
let isDragging = false;
let scrollDirection = null;

function setupAutoScroll() {
  const scrollSpeed = 15; // Speed of scrolling
  const scrollInterval = 16; // Interval for smooth scrolling (~60fps)

  function startScrolling(direction) {
    if (scrollDirection !== direction) {
      stopScrolling(); // Stop any ongoing scrolling
      scrollDirection = direction;
      isDragging = true;

      const scrollStep = direction === "up" ? -scrollSpeed : scrollSpeed;
      const autoScroll = () => {
        if (isDragging && scrollDirection) {
          window.scrollBy(0, scrollStep);
          requestAnimationFrame(autoScroll); // Use requestAnimationFrame for smoother scrolling
        }
      };
      autoScroll();
    }
  }

  function stopScrolling() {
    isDragging = false;
    scrollDirection = null;
  }

  // Detect dragover near top or bottom of the viewport
  document.addEventListener("dragover", (event) => {
    const { clientY } = event;
    const scrollZoneSize = 100; // Pixels from edge to trigger scrolling
    if (clientY < scrollZoneSize) {
      startScrolling("up");
    } else if (clientY > window.innerHeight - scrollZoneSize) {
      startScrolling("down");
    } else {
      stopScrolling();
    }
  });

  document.addEventListener("dragleave", stopScrolling); // Stop scrolling when leaving the viewport
  document.addEventListener("drop", stopScrolling); // Stop scrolling on drop
}

// Initialize all event listeners on page load
document.addEventListener("DOMContentLoaded", () => {
  setupAutoScroll(); // Set up auto-scroll functionality
  loadMealPlan(); // Load the saved plan on page load

  // Set up drag-and-drop events
  document.querySelectorAll(".day").forEach((day) => {
    day.addEventListener("dragover", allowDrop);
    day.addEventListener("drop", handleDrop);
  });

  const mealForm = document.getElementById("meal-form");
  mealForm.addEventListener("submit", searchMeals);

  const savePlanButton = document.getElementById("save-plan");
  savePlanButton.addEventListener("click", saveMealPlan);
});

