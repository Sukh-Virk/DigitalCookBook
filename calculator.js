const APP_ID = "cc0e42a4";
const APP_KEY = "a50ea574ee94d0760cf2dad3eb93b9ab";

let ingredients = [];

function addIngredient() {
    const input = document.getElementById('ingredientInput');
    const ingredient = input.value.trim();
    
    if (ingredient) {
        ingredients.push(ingredient);
        updateIngredientsList();
        input.value = '';
    }
}

function updateIngredientsList() {
    const list = document.getElementById('ingredientsList');
    list.innerHTML = '';
    
    ingredients.forEach((ingredient, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${ingredient}
            <button onclick="removeIngredient(${index})">Remove</button>
        `;
        list.appendChild(li);
    });
}

function removeIngredient(index) {
    ingredients.splice(index, 1);
    updateIngredientsList();
}

async function calculateNutrition() {
    if (ingredients.length === 0) {
        alert('Please add some ingredients first!');
        return;
    }

    const resultsSection = document.getElementById('nutritionResults');
    resultsSection.innerHTML = '<p>Calculating...</p>';

    try {
        const ingredientsList = ingredients.join('\n');
        const response = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${APP_ID}&app_key=${APP_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingr: ingredients
            })
        });

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        resultsSection.innerHTML = '<p>Error calculating nutrition. Please try again.</p>';
    }
}

function displayResults(data) {
    const resultsSection = document.getElementById('nutritionResults');
    
    resultsSection.innerHTML = `
        <h2>Nutrition Facts</h2>
        <div class="nutrition-card">
            <div class="nutrition-item">
                <h3>Calories</h3>
                <p>${Math.round(data.calories)} kcal</p>
            </div>
            <div class="nutrition-item">
                <h3>Protein</h3>
                <p>${Math.round(data.totalNutrients.PROCNT.quantity)}${data.totalNutrients.PROCNT.unit}</p>
            </div>
            <div class="nutrition-item">
                <h3>Carbs</h3>
                <p>${Math.round(data.totalNutrients.CHOCDF.quantity)}${data.totalNutrients.CHOCDF.unit}</p>
            </div>
            <div class="nutrition-item">
                <h3>Fat</h3>
                <p>${Math.round(data.totalNutrients.FAT.quantity)}${data.totalNutrients.FAT.unit}</p>
            </div>
        </div>
    `;
}