describe('Feature Integration Tests', () => {
    test('calculator with meal plan integration', async () => {
        // Test calculating nutrition then adding to meal plan
        const nutritionResult = await calculateNutrition(['100g chicken']);
        expect(nutritionResult.calories).toBeDefined();
        
        // Add to meal plan
        const mealPlan = addToMealPlan({
            title: 'Chicken',
            nutrition: nutritionResult
        });
        expect(mealPlan.meals).toContain('Chicken');
    });

    test('search with save recipe integration', async () => {
        // Search for recipe
        const searchResults = await searchRecipes(['chicken']);
        expect(searchResults.length).toBeGreaterThan(0);
        
        // Save first result
        const savedRecipe = saveRecipe(searchResults[0]);
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));
        expect(savedRecipes).toContainEqual(searchResults[0]);
    });
});