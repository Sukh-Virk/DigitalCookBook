const { displayRecipes } = require('../recommendation.js');

describe('Recipe Recommendation Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="ingredientForm">
                <input type="text" id="ingredients">
                <div id="loading-spinner" class="hidden"></div>
            </form>
            <div id="recipeResults"></div>
        `;
        global.fetch = jest.fn();
    });

    test('displays recipes based on ingredients', async () => {
        const mockRecipes = [{
            title: 'Chicken Pasta',
            image: 'pasta.jpg',
            id: 123,
            usedIngredients: [
                { name: 'chicken' },
                { name: 'pasta' }
            ]
        }];

        fetch.mockImplementation(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ readyInMinutes: 30, extendedIngredients: [], cheap: false })
            })
        );

        await displayRecipes(mockRecipes);
        expect(document.getElementById('recipeResults').innerHTML).toContain('Chicken Pasta');
    });
});