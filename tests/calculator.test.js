// Import the functions and variables from calculator.js
const fs = require('fs');
const path = require('path');
const calculatorJs = fs.readFileSync(path.resolve(__dirname, '../calculator.js'), 'utf8');

// Create a script element and inject calculator.js content
const script = document.createElement('script');
script.textContent = calculatorJs;
document.body.appendChild(script);

// Mock fetch globally
global.fetch = jest.fn();

describe('Nutrition Calculator Tests', () => {
    beforeEach(() => {
        // Reset DOM with the full structure needed
        document.body.innerHTML = `
            <div class="calculator-container">
                <div class="search-section">
                    <input type="text" id="ingredientInput" />
                    <button onclick="addIngredient()">Add Ingredient</button>
                </div>
                <div class="ingredients-list">
                    <ul id="ingredientsList"></ul>
                </div>
                <div class="results-section" id="nutritionResults"></div>
            </div>
        `;
        // Reset ingredients array
        window.ingredients = [];
        // Clear fetch mock
        fetch.mockClear();
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
        ingredients = ['100g chicken', '1 cup rice'];
        
        removeIngredient(0);
        
        expect(ingredients).toHaveLength(1);
        expect(ingredients[0]).toBe('1 cup rice');
    });

    test('calculateNutrition should handle API success', async () => {
        ingredients = ['100g chicken'];
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
        ingredients = ['invalid ingredient'];

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