const { searchRecipes } = require('../Javascript_files/search.js');

describe('Search Recipes', () => {
    test('should return recipes matching single ingredient', () => {
        const result = searchRecipes(['chicken']);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Chicken Salad');
    });

    test('should return recipes matching multiple ingredients', () => {
        const result = searchRecipes(['chicken', 'lettuce']);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Chicken Salad');
    });

    test('should return empty array for non-matching ingredients', () => {
        const result = searchRecipes(['beef']);
        expect(result).toHaveLength(0);
    });

    test('should throw error for empty ingredients array', () => {
        expect(() => searchRecipes([])).toThrow('Ingredients query parameter is required.');
    });

    test('should throw error for null ingredients', () => {
        expect(() => searchRecipes(null)).toThrow('Ingredients query parameter is required.');
    });
});