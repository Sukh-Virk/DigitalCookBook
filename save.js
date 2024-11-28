function saveRecipe(recipe) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes.push(recipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
}

function loadSavedRecipes() {
    return JSON.parse(localStorage.getItem('savedRecipes')) || [];
}

module.exports = {
    saveRecipe,
    loadSavedRecipes
};