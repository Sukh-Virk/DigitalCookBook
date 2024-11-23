document.getElementById("ingredientForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const ingredientsInput = document.getElementById("ingredients").value.trim();
    if (!ingredientsInput) {
      alert("Please enter some ingredients.");
      return;
    }
  
    const ingredients = ingredientsInput.split(",").map((ing) => ing.trim().toLowerCase());
    const apiKey = "0f95ca855ef747688a8c3fa3c16aac69";
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
      ","
    )}&number=10&apiKey=${apiKey}`;
  
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipes.");
        }
        return response.json();
      })
      .then((data) => {
        displayRecipes(data);
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred. Please try again.");
      });
  });
  
  function displayRecipes(recipes) {
    const resultsDiv = document.getElementById("recipeResults");
    resultsDiv.innerHTML = ""; // Clear previous results
  
    if (recipes.length === 0) {
      resultsDiv.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
      return;
    }
  
    recipes.forEach((recipe) => {
      // Get a short list of ingredients for the card display
      const ingredientList = recipe.usedIngredients
        .slice(0, 3) // Limit to 3 ingredients
        .map((ing) => ing.name)
        .join(", ");
  
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
  
      recipeDiv.innerHTML = `
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>Based on your preferred ingredients, we recommend:</p>
        <p><strong>Key Ingredients:</strong> ${ingredientList}</p>
        <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s/g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
      `;
  
      resultsDiv.appendChild(recipeDiv);
    });
  }