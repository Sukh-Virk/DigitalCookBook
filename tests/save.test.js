const { saveRecipe, loadSavedRecipes } = require('../save.js');

describe('Save Recipe Tests', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <div id="saved-recipes"></div>
            <button id="save-recipe">Save Recipe</button>
        `;
    });

    test('saves recipe to localStorage', () => {
        const recipe = {
            id: 1,
            title: 'Pasta Carbonara',
            ingredients: ['pasta', 'eggs', 'cheese']
        };

        saveRecipe(recipe);
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        expect(savedRecipes).toContainEqual(recipe);
    });
});