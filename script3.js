const apiKey = "bc1d8e174ce34f27b702bd643a4d4231"; // Your Spoonacular API Key
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const savedMealsList = document.getElementById("saved-meals-list");
const savedMeals = new Map(); // Map to store saved meals by ID

// Handle Search Form Submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a meal to search.");
    return;
  }

  searchResults.innerHTML = "<p>Loading...</p>";
  loader.style.display = "block";

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`
    );
    const data = await response.json();
    loader.style.display = "none";

    if (data.results.length === 0) {
      searchResults.innerHTML = "<p>No meals found.</p>";
    } else {
      displaySearchResults(data.results);
    }
  } catch (error) {
    console.error("Error fetching data from Spoonacular:", error);
    searchResults.innerHTML = "<p>Something went wrong. Please try again.</p>";
  }
});

// Display Search Results
function displaySearchResults(meals) {
  searchResults.innerHTML = ""; // Clear previous results

  meals.forEach((meal) => {
    const mealItem = document.createElement("li");
    mealItem.innerHTML = `
      <img src="${meal.image}" alt="${meal.title}" />
      <span>${meal.title}</span>
      <button class="save-btn" data-id="${meal.id}" title="Save Meal">Save</button>
    `;

    // Add save functionality
    const saveButton = mealItem.querySelector(".save-btn");
    saveButton.addEventListener("click", () => saveMeal(meal));

    searchResults.appendChild(mealItem);
  });
}

// Save Meal to Saved List
function saveMeal(meal) {
  if (savedMeals.has(meal.id)) {
    alert(`${meal.title} is already in your saved meals.`);
    return;
  }

  savedMeals.set(meal.id, meal);
  updateSavedMealsList();
}

// Update the Saved Meals List
function updateSavedMealsList() {
  savedMealsList.innerHTML = ""; // Clear the current saved list

  savedMeals.forEach((meal) => {
    const mealItem = document.createElement("li");
    mealItem.innerHTML = `
      <img src="${meal.image}" alt="${meal.title}" />
      <span>${meal.title}</span>
      <button class="remove-btn" data-id="${meal.id}" title="Remove Meal">Remove</button>
    `;

    // Add remove functionality
    const removeButton = mealItem.querySelector(".remove-btn");
    removeButton.addEventListener("click", () => removeMeal(meal.id));

    savedMealsList.appendChild(mealItem);
  });
}

// Remove Meal from Saved List
function removeMeal(mealId) {
  if (savedMeals.has(mealId)) {
    savedMeals.delete(mealId);
    updateSavedMealsList();
  }
}
