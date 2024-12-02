jest.mock('../Javascript_files/search.js');
jest.mock('../Javascript_files/difficulty-estimator.js');

const { searchRecipes } = require('../Javascript_files/search.js');
const difficultyEstimator = require('../Javascript_files/difficulty-estimator.js');

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
            </main>
        `;
    });

    test('search results integrate with difficulty calculation', () => {
        const mockRecipe = {
            title: 'Chicken Salad',
            ingredients: ['chicken', 'lettuce']
        };

        searchRecipes.mockReturnValue([mockRecipe]);
        difficultyEstimator.findDifficulty.mockImplementation(() => {
            document.getElementById('output').innerHTML = 'Your Difficulty is 4.5';
            document.getElementById('diffMedium').className = 'example-card-Selected';
        });

        const searchResults = searchRecipes(['chicken', 'lettuce']);
        expect(searchResults.length).toBe(1);
        
        const recipe = searchResults[0];
        document.getElementById('ingredientsNum').value = recipe.ingredients.length;
        document.getElementById('recipeText').value = recipe.ingredients.join(' ');
        
        const outputHeader = document.getElementById('output');
        difficultyEstimator.findDifficulty(outputHeader);
        
        expect(outputHeader.innerHTML).toContain('Your Difficulty is');
        expect(document.querySelector('.example-card-Selected')).not.toBeNull();
    });
});