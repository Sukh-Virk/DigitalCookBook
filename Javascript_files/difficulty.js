export async function findInfo(apiUrlInfo) {
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