const { calculateNutrition, addIngredient, removeIngredient, ingredients, displayResults } = require('../calculator.js');

describe('Nutrition Calculator Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="calculator-container">
                <div class="search-section">
                    <input type="text" id="ingredientInput" />
                    <button id="addButton">Add Ingredient</button>
                </div>
                <div class="ingredients-list">
                    <ul id="ingredientsList"></ul>
                </div>
                <div class="results-section" id="nutritionResults"></div>
            </div>
        `;
        // Reset ingredients array before each test
        ingredients.length = 0;
        global.fetch = jest.fn();
    });

    test('addIngredient should add ingredient to list', () => {
        const input = document.getElementById('ingredientInput');
        input.value = '100g chicken';
        
        addIngredient();
        
        expect(ingredients).toHaveLength(1);
        expect(ingredients[0]).toBe('100g chicken');
        expect(input.value).toBe('');
    });

    test('removeIngredient should remove ingredient from list', () => {
        ingredients.push('100g chicken', '1 cup rice');
        
        removeIngredient(0);
        
        expect(ingredients).toHaveLength(1);
        expect(ingredients[0]).toBe('1 cup rice');
    });

    test('calculateNutrition should handle API success', async () => {
        ingredients.push('100g chicken');
        const mockResponse = {
            calories: 165,
            totalNutrients: {
                PROCNT: { quantity: 31, unit: 'g' },
                CHOCDF: { quantity: 0, unit: 'g' },
                FAT: { quantity: 3.6, unit: 'g' }
            }
        };

        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        );

        await calculateNutrition();

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.edamam.com/api/nutrition-details'),
            expect.any(Object)
        );

        const results = document.getElementById('nutritionResults');
        expect(results.innerHTML).toContain('165 kcal');
        expect(results.innerHTML).toContain('31g');
    });

    test('calculateNutrition should handle API error', async () => {
        ingredients.push('invalid ingredient');

        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: false
            })
        );

        await calculateNutrition();

        const results = document.getElementById('nutritionResults');
        expect(results.innerHTML).toContain('Error calculating nutrition');
    });
});