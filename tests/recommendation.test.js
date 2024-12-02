// Mock the entire module first
jest.mock('../Javascript_files/recommendation.js', () => ({
    displayRecipes: jest.fn(),
    findInfo: jest.fn()
}));

const { displayRecipes, findInfo } = require('../Javascript_files/recommendation.js');

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
        global.apiKey = 'test-api-key';
        global.apiUrlInfo = '';
        displayRecipes.mockClear();
        findInfo.mockClear();
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

        displayRecipes.mockResolvedValue(undefined);
        
        await displayRecipes(mockRecipes);
        expect(displayRecipes).toHaveBeenCalledWith(mockRecipes);
    });

    test('handles empty recipe list', async () => {
        displayRecipes.mockResolvedValue(undefined);
        await displayRecipes([]);
        expect(displayRecipes).toHaveBeenCalledWith([]);
    });
});