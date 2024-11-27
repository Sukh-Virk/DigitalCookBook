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

        const saveButton = document.getElementById('save-recipe');
        saveButton.addEventListener('click', () => saveRecipe(recipe));
        saveButton.click();

        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));
        expect(savedRecipes).toContainEqual(recipe);
    });
});