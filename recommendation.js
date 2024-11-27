let apiUrlInfo = "";
const apiKey = "2ff1946c55d04a3eb0ff3ab7fc954670";
document.getElementById("ingredientForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const ingredientsInput = document.getElementById("ingredients").value.trim();
    if (!ingredientsInput) {
      alert("Please enter some ingredients.");
      return;
    }
    
    const ingredients = ingredientsInput.split(",").map((ing) => ing.trim().toLowerCase());
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
  
  async function displayRecipes(recipes) {
    const resultsDiv = document.getElementById("recipeResults");
    resultsDiv.innerHTML = ""; // Clear previous results
  
    if (recipes.length === 0) {
      resultsDiv.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
      return;
    }
  
    recipes.forEach(async function(recipe){
      // Get a short list of ingredients for the card display
      const ingredientList = recipe.usedIngredients
        .slice(0, 3) // Limit to 3 ingredients
        .map((ing) => ing.name)
        .join(", ");
      
      let difficulty = 0.0;
      let difficultyText = "";
      let foodID = recipe.id;
      apiUrlInfo = "";
      apiUrlInfo += `https://api.spoonacular.com/recipes/${foodID}/information?apiKey=${apiKey}`;
      
      difficulty = await findInfo();
      if(difficulty==0){
        difficultyText+= "Difficulty: undefined";
      }else{
        difficultyText+= `Difficulty: ${difficulty}/10`;
      }

      console.log(difficultyText);
  
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
  
      recipeDiv.innerHTML = `
        <p>Based on your preferred ingredients, we recommend:</p>
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>${difficultyText}</p>
        <p><strong>Key Ingredients:</strong> ${ingredientList}</p>
        <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s/g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
      `;
  
      resultsDiv.appendChild(recipeDiv);
    });
  }

  async function findInfo() {
    let difficulty = 0.0;
    let cookingTime = 0.0;
    let ingredientNum = 0.0;
    let cheap = false;
  
    try {
      const response = await fetch(apiUrlInfo);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
      }
  
      const data = await response.json();
      cookingTime += data.readyInMinutes;
      ingredientNum += data.extendedIngredients.length;
      cheap = data.cheap;
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
      return 0.0; // Return 0.0 early if there's an error
    }
  
    // Calculate points after the async operations are done
    let timePoints = Math.min(cookingTime / 12, 4.5);
    let ingPoints = Math.min(ingredientNum / 4, 4.5);
  
    if (cheap) {
      difficulty += 1;
    }
    if (timePoints == 0 || ingPoints == 0) {
      return 0.0;
    }
    
    difficulty += (timePoints + ingPoints);
    difficulty = difficulty.toFixed(1);
    return difficulty;
  }