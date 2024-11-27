describe('Recipe Recommendation Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="ingredientForm">
                <input type="text" id="ingredients">
            </form>
            <div id="recipeResults"></div>
        `;
        global.fetch = jest.fn();
    });

    test('displays recipes based on ingredients', async () => {
        const mockRecipes = [
            {
                title: 'Chicken Pasta',
                image: 'pasta.jpg',
                usedIngredients: [
                    { name: 'chicken' },
                    { name: 'pasta' }
                ]
            }
        ];

        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRecipes)
            })
        );

        document.getElementById('ingredients').value = 'chicken,pasta';
        document.getElementById('ingredientForm').dispatchEvent(new Event('submit'));

        await new Promise(resolve => setTimeout(resolve, 0));
        expect(document.getElementById('recipeResults').innerHTML).toContain('Chicken Pasta');
    });
});