function searchRecipes(ingredients) {
    if (!ingredients || ingredients.length === 0) {
      throw new Error('Ingredients query parameter is required.');
    }
  
    const mockRecipes = [
      { title: 'Chicken Salad', ingredients: ['chicken', 'lettuce'], difficulty: 'easy' },
      { title: 'Broccoli Soup', ingredients: ['broccoli'], difficulty: 'medium' },
    ];
  
    return mockRecipes.filter(recipe =>
      ingredients.every(ingredient => recipe.ingredients.includes(ingredient))
    );
  }
  
  module.exports = { searchRecipes };
  