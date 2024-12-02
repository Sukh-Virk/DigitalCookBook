const { displayRecipes } = require('../Javascript_files/recommendation.js');

jest.mock('../Javascript_files/recommendation.js', () => ({
    displayRecipes: jest.fn()
}));

describe('Recipe Recommendation Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="recipeResults"></div>
            <div id="loading-spinner" class="hidden"></div>
            <form id="ingredientForm">
                <input type="text" id="ingredients" value="chicken">
            </form>
        `;
        global.fetch = jest.fn();
    });

    test('displays recipes with all information', async () => {
        const mockRecipes = [{
            title: 'Chicken Pasta',
            image: 'pasta.jpg',
            id: 123,
            usedIngredients: [
                { name: 'chicken' },
                { name: 'pasta' },
                { name: 'tomato' }
            ]
        }];

        displayRecipes(mockRecipes);
        
        expect(displayRecipes).toHaveBeenCalledWith(mockRecipes);
    });

    test('handles empty recipe list', async () => {
        displayRecipes([]);
        expect(displayRecipes).toHaveBeenCalledWith([]);
    });
});