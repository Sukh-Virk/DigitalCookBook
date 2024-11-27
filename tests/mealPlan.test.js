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
    });

    test('search meals returns recipes', async () => {
        const mockRecipes = {
            results: [
                { id: 1, title: 'Pasta', image: 'pasta.jpg' }
            ]
        };

        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRecipes)
            })
        );

        document.getElementById('meal-search').value = 'pasta';
        const form = document.getElementById('meal-form');
        form.dispatchEvent(new Event('submit'));

        await new Promise(resolve => setTimeout(resolve, 0));
        expect(document.getElementById('search-results').innerHTML).toContain('pasta');
    });

    test('drag and drop functionality', () => {
        const draggedItem = document.createElement('li');
        draggedItem.id = 'recipe-1';
        
        const dropEvent = new Event('drop');
        const dayElement = document.querySelector('.day');
        dayElement.dispatchEvent(dropEvent);

        expect(dayElement.querySelector('ul').children.length).toBe(1);
    });
});