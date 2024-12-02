// Global variable to store the API URL for fetching recipe information
let apiUrlInfo = "";

// API key for accessing the Spoonacular API
const apiKey = "1d3658f299d5432c910aad2df2ca8f71";

/**
 * Initializes event listeners on the web page.
 * Primarily sets up the form submission handler for searching recipes.
 */
function initializeEventListeners() {
    // Check if the code is running in a browser environment
    if (typeof document !== 'undefined') {
        // Get the form element for ingredients submission
        const form = document.getElementById("ingredientForm");
        if (form) {
            // Add a 'submit' event listener to handle form submissions
            form.addEventListener("submit", function (e) {
                e.preventDefault(); // Prevent the default form submission behavior

                // Get and validate the user input for ingredients
                const ingredientsInput = document.getElementById("ingredients").value.trim();
                if (!ingredientsInput) {
                    alert("Please enter some ingredients."); // Alert if no ingredients are provided
                    return;
                }

                // Show the loading spinner while fetching recipes
                const loadingSpinner = document.getElementById("loading-spinner");
                loadingSpinner.classList.remove("hidden");

                // Process the user input into a list of ingredients
                const ingredients = ingredientsInput.split(",").map((ing) => ing.trim().toLowerCase());

                // Construct the API URL to fetch recipes based on ingredients
                const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
                    ","
                )}&number=10&apiKey=${apiKey}`;

                // Fetch recipes from the Spoonacular API
                fetch(apiUrl)
                    .then((response) => {
                        if (!response.ok) {
                            // Handle errors in the API response
                            return response.json().then((err) => {
                                console.error("API Error:", err);
                                throw new Error(err.message || "Failed to fetch recipes.");
                            });
                        }
                        return response.json();
                    })
                    .then((data) => {
                        // Display the fetched recipes
                        displayRecipes(data);
                    })
                    .catch((error) => {
                        // Handle any errors during the fetch process
                        console.error("Fetch Error:", error);
                        alert(`An error occurred: ${error.message}`);
                    })
                    .finally(() => {
                        // Hide the loading spinner after processing is complete
                        loadingSpinner.classList.add("hidden");
                    });
            });
        }
    }
}

/**
 * Displays the list of recipes fetched from the API.
 * @param {Array} recipes - List of recipe objects returned by the API.
 */
async function displayRecipes(recipes) {
    const resultsDiv = document.getElementById("recipeResults"); // Get the results container
    resultsDiv.innerHTML = ""; // Clear previous results

    // If no recipes are found, display a message
    if (recipes.length === 0) {
        resultsDiv.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    } else {
        // Display a heading for the recipes
        resultsDiv.innerHTML = `<div class="recipeIntro">Based on your preferred ingredients, we recommend:</div>`;
    }

    // Loop through the list of recipes and display each one
    for (const recipe of recipes) {
        // Extract and format the key ingredients for the recipe
        const ingredientList = recipe.usedIngredients
            .slice(0, 3) // Limit to the first 3 ingredients
            .map((ing) => ing.name)
            .join(", ");

        let difficulty = 0.0;
        let difficultyText = "";
        let foodID = recipe.id;

        // Construct the API URL to fetch detailed recipe information
        apiUrlInfo = `https://api.spoonacular.com/recipes/${foodID}/information?apiKey=${apiKey}`;

        // Fetch the difficulty level for the recipe
        difficulty = await findInfo();
        if (difficulty == 0) {
            difficultyText += " undefined"; // Default text if difficulty cannot be determined
        } else {
            difficultyText += ` ${difficulty}/10`; // Display the difficulty level
        }

        // Create a new div element for the recipe
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        // Populate the recipe details
        recipeDiv.innerHTML = `
            <div class="recipeName">${recipe.title}</div>
            <hr>
            <div class="recipeMain">
                <img src="${recipe.image}" class="recipeImage" alt="${recipe.title}">
                <div class="recipeInfo">
                    <div class="recipeIng"><strong>Key Ingredients:</strong> ${ingredientList}</div>
                    <div class="recipeDiff"><strong>Difficulty:</strong>${difficultyText}</div>
                    <div class="recipeLink">
                        <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s/g, "-")}-${recipe.id}" target="_blank">View Recipe -></a>
                    </div>
                </div>
            </div>
        `;

        // Append the recipe div to the results container
        resultsDiv.appendChild(recipeDiv);
    }
}

/**
 * Fetches detailed information about a recipe and calculates its difficulty level.
 * @returns {number} - Calculated difficulty level of the recipe.
 */
async function findInfo() {
    let difficulty = 0.0;
    let cookingTime = 0.0;
    let ingredientNum = 0.0;
    let cheap = false;

    try {
        // Fetch detailed recipe information from the API
        const response = await fetch(apiUrlInfo);
        if (!response.ok) {
            const errData = await response.json();
            console.error("API Detail Fetch Error:", errData);
            throw new Error(errData.message || "Failed to fetch recipe details.");
        }

        // Extract relevant data from the API response
        const data = await response.json();
        cookingTime += data.readyInMinutes; // Cooking time
        ingredientNum += data.extendedIngredients.length; // Number of ingredients
        cheap = data.cheap; // Whether the recipe is budget-friendly
    } catch (error) {
        // Handle errors during data fetch
        console.error("Detail Fetch Error:", error);
        alert(`An error occurred while fetching recipe details: ${error.message}`);
        return 0.0; // Return default difficulty in case of an error
    }

    // Calculate difficulty points based on cooking time and ingredient count
    let timePoints = Math.min(cookingTime / 12, 4.5);
    let ingPoints = Math.min(ingredientNum / 4, 4.5);

    // Add bonus points for budget-friendly recipes
    if (cheap) {
        difficulty += 1;
    }
    // If either time or ingredient points are zero, set difficulty to 0
    if (timePoints === 0 || ingPoints === 0) {
        return 0.0;
    }

    // Sum up the calculated difficulty points
    difficulty += timePoints + ingPoints;
    difficulty = difficulty.toFixed(1); // Format difficulty to 1 decimal place
    return difficulty;
}

// Export functions for use in other files
module.exports = { displayRecipes, findInfo, initializeEventListeners };

// Automatically initialize event listeners in a browser environment
if (typeof document !== 'undefined') {
    initializeEventListeners();
}