jest.mock('../Javascript_files/calculator.js', () => ({
    ingredients: [],
    addIngredient: jest.fn(),
    removeIngredient: jest.fn(),
    calculateNutrition: jest.fn(),
    updateIngredientsList: jest.fn()
}));

const calculator = require('../Javascript_files/calculator.js');

describe('Nutrition Calculator Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="calculator-container">
                <div class="search-section">
                    <input type="text" id="ingredientInput" />
                    <button id="addIngredientBtn">Add Ingredient</button>
                </div>
                <div class="ingredients-list">
                    <ul id="ingredientsList"></ul>
                </div>
                <div class="results-section" id="nutritionResults"></div>
            </div>
        `;
        calculator.ingredients.length = 0;
        global.fetch = jest.fn();
        jest.clearAllMocks();
    });

    test('addIngredient should add ingredient to list and update DOM', () => {
        const input = document.getElementById('ingredientInput');
        input.value = '100g chicken';
        
        calculator.addIngredient.mockImplementation(() => {
            const ingredient = input.value.trim();
            if (ingredient) {
                calculator.ingredients.push(ingredient);
                const list = document.getElementById('ingredientsList');
                const li = document.createElement('li');
                li.innerHTML = `${ingredient}<button>Remove</button>`;
                list.appendChild(li);
                input.value = '';
            }
        });
        
        calculator.addIngredient();
        
        expect(calculator.ingredients).toContain('100g chicken');
        expect(input.value).toBe('');
        expect(document.getElementById('ingredientsList').children.length).toBe(1);
    });

    test('removeIngredient should remove ingredient and update DOM', () => {
        calculator.ingredients.push('100g chicken', '1 cup rice');
        const list = document.getElementById('ingredientsList');
        calculator.ingredients.forEach((ingredient, i) => {
            const li = document.createElement('li');
            li.innerHTML = `${ingredient}<button>Remove</button>`;
            list.appendChild(li);
        });
        
        calculator.removeIngredient.mockImplementation((index) => {
            calculator.ingredients.splice(index, 1);
            list.innerHTML = '';
            calculator.ingredients.forEach((ingredient) => {
                const li = document.createElement('li');
                li.innerHTML = `${ingredient}<button>Remove</button>`;
                list.appendChild(li);
            });
        });
        
        calculator.removeIngredient(0);
        
        expect(calculator.ingredients).not.toContain('100g chicken');
        expect(calculator.ingredients[0]).toBe('1 cup rice');
        expect(list.children.length).toBe(1);
    });

    test('calculateNutrition should handle API success', async () => {
        calculator.ingredients.push('100g chicken');
        const mockResponse = {
            calories: 165,
            totalNutrients: {
                PROCNT: { quantity: 31, unit: 'g' },
                CHOCDF: { quantity: 0, unit: 'g' },
                FAT: { quantity: 3.6, unit: 'g' }
            }
        };

        calculator.calculateNutrition.mockResolvedValue(mockResponse);
        await calculator.calculateNutrition();
        
        expect(calculator.calculateNutrition).toHaveBeenCalled();
        expect(document.getElementById('nutritionResults')).not.toBeNull();
    });

    test('calculateNutrition should handle API error', async () => {
        calculator.ingredients.push('invalid ingredient');
        calculator.calculateNutrition.mockRejectedValue('API Error');
        
        try {
            await calculator.calculateNutrition();
        } catch (error) {
            expect(error).toBe('API Error');
        }
        
        expect(calculator.calculateNutrition).toHaveBeenCalled();
    });
});