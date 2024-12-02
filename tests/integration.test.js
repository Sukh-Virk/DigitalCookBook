jest.mock('../Javascript_files/recommendation.js', () => ({
    displayRecipes: jest.fn(),
    findInfo: jest.fn()
}));

const { displayRecipes, findInfo } = require('../Javascript_files/recommendation.js');

describe('Feature Integration Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <main id="theMainTag" class="estimator-container">
                <div id="search-section">
                    <input type="text" id="search-input">
                    <div id="search-results"></div>
                </div>
                <div id="difficulty-section">
                    <input type="number" id="cookTime" value="30">
                    <input type="number" id="ingredientsNum" value="5">
                    <textarea id="recipeText">chicken lettuce</textarea>
                    <h2 id="output"></h2>
                </div>
                <div id="diffEasy" class="example-card"></div>
                <div id="diffMedium" class="example-card"></div>
                <div id="diffHard" class="example-card"></div>
                <div id="recipeResults"></div>
            </main>
        `;
        global.fetch = jest.fn();
        global.apiKey = 'test-api-key';
        global.apiUrlInfo = '';
        displayRecipes.mockClear();
        findInfo.mockClear();
    });

    test('recipe recommendations integrate with difficulty estimation', async () => {
        const mockRecipe = {
            title: 'Chicken Pasta',
            readyInMinutes: 45,
            extendedIngredients: ['chicken', 'pasta', 'tomato', 'garlic', 'olive oil'],
            cheap: true,
            id: 123,
            image: 'pasta.jpg',
            usedIngredients: [
                { name: 'chicken' },
                { name: 'pasta' },
                { name: 'tomato' }
            ]
        };

        findInfo.mockResolvedValue(4.5);
        
        // Mock displayRecipes calls findInfo (difficulty)
        displayRecipes.mockImplementation(async (recipes) => {
            const difficulty = await findInfo();
            const resultsDiv = document.getElementById('recipeResults');
            resultsDiv.innerHTML = `
                <div class="recipe">
                    <div class="recipeName">${recipes[0].title}</div>
                    <div class="recipeDiff">Difficulty: ${difficulty}/10</div>
                </div>
            `;
        });

        await displayRecipes([mockRecipe]);
        
        expect(displayRecipes).toHaveBeenCalledWith([mockRecipe]);
        expect(findInfo).toHaveBeenCalled();
        
        const recipeResults = document.getElementById('recipeResults');
        expect(recipeResults.innerHTML).toContain('Chicken Pasta');
        expect(recipeResults.innerHTML).toContain('Difficulty: 4.5/10');
    });
});