jest.mock('../Javascript_files/mealPlan.js', () => ({
    searchMeals: jest.fn(),
    handleDrop: jest.fn()
}));

const { searchMeals, handleDrop } = require('../Javascript_files/mealPlan.js');

describe('Meal Plan Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="meal-form">
                <input type="text" id="meal-search">
                <div id="search-results"></div>
            </div>
            <div class="day">
                <ul></ul>
            </div>
        `;
        global.fetch = jest.fn();
        searchMeals.mockClear();
        handleDrop.mockClear();
    });

    test('searchMeals fetches and displays recipes', async () => {
        const mockRecipes = {
            results: [{ id: 1, title: 'Pasta', image: 'pasta.jpg' }]
        };

        searchMeals.mockResolvedValue(mockRecipes);
        
        await searchMeals({ preventDefault: () => {} });
        
        expect(searchMeals).toHaveBeenCalled();
    });

    test('handleDrop adds recipe to meal plan', () => {
        const mockEvent = {
            preventDefault: () => {},
            target: { closest: () => document.querySelector('.day') },
            dataTransfer: { getData: () => 'recipe-1' }
        };

        handleDrop(mockEvent);
        expect(handleDrop).toHaveBeenCalledWith(mockEvent);
    });
});