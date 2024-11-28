// Import the required functions first
const { calculateNutrition } = require('../calculator.js');
const { searchRecipes } = require('../search.js');
const { addToMealPlan } = require('../mealPlan.js');
const { saveRecipe } = require('../save.js');

describe('Feature Integration Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="nutritionResults"></div>
            <div id="mealPlan"></div>
            <div id="saved-recipes"></div>
        `;
        localStorage.clear();
        global.fetch = jest.fn();
    });

    test('calculator with meal plan integration', async () => {
        const mockNutritionResponse = {
            calories: 165,
            totalNutrients: {
                PROCNT: { quantity: 31, unit: 'g' }
            }
        };

        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockNutritionResponse)
            })
        );

        await calculateNutrition(['100g chicken']);
        const mealPlanElement = document.getElementById('mealPlan');
        expect(mealPlanElement.innerHTML).toContain('165 kcal');
    });
});