const { searchMeals, handleDrop } = require('../mealPlan.js');

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

        const form = document.getElementById('meal-form');
        form.addEventListener('submit', searchMeals);
        
        document.getElementById('meal-search').value = 'pasta';
        form.dispatchEvent(new Event('submit'));

        await new Promise(resolve => setTimeout(resolve, 100));
        expect(document.getElementById('search-results').innerHTML).toContain('Pasta');
    });

    test('drag and drop functionality', () => {
        // Create the dragged item first
        const draggedItem = document.createElement('li');
        draggedItem.id = 'recipe-1';
        draggedItem.innerHTML = '<img src="pasta.jpg" alt="Pasta"><span>Pasta</span>';
        document.body.appendChild(draggedItem);

        // Create the day element with proper structure
        const dayElement = document.querySelector('.day');
        const ulElement = dayElement.querySelector('ul');

        // Create a mock event with proper structure
        const mockEvent = {
            preventDefault: () => {},
            target: {
                closest: (selector) => {
                    if (selector === '.day') return dayElement;
                    return null;
                }
            },
            dataTransfer: {
                getData: () => 'recipe-1'
            }
        };

        // Execute handleDrop with our mock event
        handleDrop(mockEvent);
    
        // Verify the result
        expect(ulElement.children.length).toBe(1);
        expect(ulElement.querySelector('li')).not.toBeNull();
        expect(ulElement.querySelector('li').id).toBe('recipe-1');
    });
});