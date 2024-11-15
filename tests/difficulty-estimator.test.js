/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Create a script element and inject difficulty-estimator.js content
const diffEstimatorContent = fs.readFileSync(path.resolve(__dirname, '../difficulty-estimator.js'), 'utf8');
const script = document.createElement('script');
script.textContent = diffEstimatorContent;

describe('Difficulty Estimator Tests', () => {
    beforeEach(() => {
        // Set up DOM first
        document.body.innerHTML = `
            <div id="theMainTag"></div>
            <div id="difficulty-form"></div>
            <input id="cookTime" value="30" />
            <input id="ingredientsNum" value="10" />
            <input id="recipeText" value="flour sugar eggs butter milk" />
            <div id="diffEasy" class="example-card"></div>
            <div id="diffMedium" class="example-card"></div>
            <div id="diffHard" class="example-card"></div>
            <button id="myButton"></button>
        `;

        // Inject the script after DOM setup
        document.body.appendChild(script);

        // Make functions globally available
        window.findDifficulty = findDifficulty;
        window.returnToDefault = returnToDefault;
        window.changeToSelected = changeToSelected;
        window.countIng = countIng;
    });

    test('findDifficulty calculates difficulty and updates DOM', () => {
        // Simulate a click on the button to call findDifficulty
        document.getElementById("myButton").onclick = findDifficulty;
        document.getElementById("myButton").click();

        // Check if the difficulty is displayed in a header
        const header = document.querySelector("h2");
        expect(header).not.toBeNull();
        expect(header.textContent).toMatch(/Your Difficulty is/);

        // Verify that the correct difficulty box is selected
        const difficulty = parseFloat(header.textContent.split(" ")[3]);
        if (difficulty < 4) {
            expect(document.getElementById("diffEasy").className).toBe("example-card-Selected");
        } else if (difficulty < 8) {
            expect(document.getElementById("diffMedium").className).toBe("example-card-Selected");
        } else {
            expect(document.getElementById("diffHard").className).toBe("example-card-Selected");
        }
    });

    test('returnToDefault resets all difficulty classes', () => {
        // Set initial classes
        document.getElementById("diffEasy").className = "example-card-Selected";
        document.getElementById("diffMedium").className = "example-card-Selected";
        document.getElementById("diffHard").className = "example-card-Selected";

        // Call the function to reset classes
        returnToDefault();

        // Check if all classes are reset to "example-card"
        expect(document.getElementById("diffEasy").className).toBe("example-card");
        expect(document.getElementById("diffMedium").className).toBe("example-card");
        expect(document.getElementById("diffHard").className).toBe("example-card");
    });

    test('changeToSelected applies correct difficulty class', () => {
        // Test for easy difficulty
        changeToSelected(3.5);
        expect(document.getElementById("diffEasy").className).toBe("example-card-Selected");

        // Test for medium difficulty
        changeToSelected(6);
        expect(document.getElementById("diffMedium").className).toBe("example-card-Selected");

        // Test for hard difficulty
        changeToSelected(9);
        expect(document.getElementById("diffHard").className).toBe("example-card-Selected");
    });

    test('countIng calculates correct word count in recipe text', () => {
        // Set the recipe text input value
        const recipeText = document.getElementById("recipeText");
        recipeText.value = "flour sugar eggs butter milk vanilla";

        // Run the function and check the count
        const count = countIng();
        expect(count).toBe(6);
    });
});
