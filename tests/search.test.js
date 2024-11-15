const { searchRecipes } = require('../search'); // Adjust path as necessary

describe('Search Recipes', () => {
  it('should return recipes matching ingredients', () => {
    const result = searchRecipes(['chicken']);
    expect(result).toEqual([
      { title: 'Chicken Salad', ingredients: ['chicken', 'lettuce'], difficulty: 'easy' },
    ]);
  });

  it('should throw an error for missing ingredients', () => {
    expect(() => searchRecipes([])).toThrow('Ingredients query parameter is required.');
  });

  it('should return no recipes for non-matching ingredients', () => {
    const result = searchRecipes(['pasta']);
    expect(result).toEqual([]);
  });
});
