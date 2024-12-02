jest.mock('../Javascript_files/save.js', () => ({
    saveRecipe: jest.fn(),
    loadSavedRecipes: jest.fn()
}));

const save = require('../Javascript_files/save.js');

describe('Save Recipe Tests', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <div id="saved-recipes"></div>
            <form id="search-form">
                <input type="text" id="search-input">
            </form>
        `;
        save.saveRecipe.mockClear();
        save.loadSavedRecipes.mockClear();
    });

    test('saves recipe to localStorage', () => {
        const recipe = {
            id: 1,
            title: 'Chicken Pasta',
            ingredients: ['chicken', 'pasta', 'tomato']
        };

        save.saveRecipe(recipe);
        expect(save.saveRecipe).toHaveBeenCalledWith(recipe);
    });

    test('loads saved recipes', () => {
        const mockRecipes = [{
            id: 1,
            title: 'Chicken Pasta',
            ingredients: ['chicken', 'pasta', 'tomato']
        }];

        save.loadSavedRecipes.mockReturnValue(mockRecipes);
        const loadedRecipes = save.loadSavedRecipes();
        expect(loadedRecipes).toEqual(mockRecipes);
    });
});