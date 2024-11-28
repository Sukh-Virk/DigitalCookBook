let apiUrlInfo = "";
const apiKey = "bc1d8e174ce34f27b702bd643a4d4231";

document.getElementById("ingredientForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const ingredientsInput = document.getElementById("ingredients").value.trim();
    if (!ingredientsInput) {
        alert("Please enter some ingredients.");
        return;
    }

    // Show the loading spinner
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("hidden");

    const ingredients = ingredientsInput.split(",").map((ing) => ing.trim().toLowerCase());
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
        ","
    )}&number=10&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    console.error("API Error:", err);
                    throw new Error(err.message || "Failed to fetch recipes.");
                });
            }
            return response.json();
        })
        .then((data) => {
            displayRecipes(data);
        })
        .catch((error) => {
            console.error("Fetch Error:", error);
            alert(`An error occurred: ${error.message}`);
        })
        .finally(() => {
            // Hide the loading spinner after fetching data
            loadingSpinner.classList.add("hidden");
        });
});

async function displayRecipes(recipes) {
    const resultsDiv = document.getElementById("recipeResults");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (recipes.length === 0) {
        resultsDiv.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    } else {
        resultsDiv.innerHTML = `<div class="recipeIntro">Based on your preferred ingredients, we recommend:</div>`;
    }

    for (const recipe of recipes) {
        const ingredientList = recipe.usedIngredients
            .slice(0, 3) // Limit to 3 ingredients
            .map((ing) => ing.name)
            .join(", ");

        let difficulty = 0.0;
        let difficultyText = "";
        let foodID = recipe.id;
        apiUrlInfo = `https://api.spoonacular.com/recipes/${foodID}/information?apiKey=${apiKey}`;

        difficulty = await findInfo();
        if (difficulty == 0) {
            difficultyText += " undefined";
        } else {
            difficultyText += ` ${difficulty}/10`;
        }

        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

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

        resultsDiv.appendChild(recipeDiv);
    }
}

async function findInfo() {
    let difficulty = 0.0;
    let cookingTime = 0.0;
    let ingredientNum = 0.0;
    let cheap = false;

    try {
        const response = await fetch(apiUrlInfo);
        if (!response.ok) {
            const errData = await response.json();
            console.error("API Detail Fetch Error:", errData);
            throw new Error(errData.message || "Failed to fetch recipe details.");
        }

        const data = await response.json();
        cookingTime += data.readyInMinutes;
        ingredientNum += data.extendedIngredients.length;
        cheap = data.cheap;
    } catch (error) {
        console.error("Detail Fetch Error:", error);
        alert(`An error occurred while fetching recipe details: ${error.message}`);
        return 0.0; // Return 0.0 early if there's an error
    }

    let timePoints = Math.min(cookingTime / 12, 4.5);
    let ingPoints = Math.min(ingredientNum / 4, 4.5);

    if (cheap) {
        difficulty += 1;
    }
    if (timePoints === 0 || ingPoints === 0) {
        return 0.0;
    }

    difficulty += timePoints + ingPoints;
    difficulty = difficulty.toFixed(1);
    return difficulty;
}

