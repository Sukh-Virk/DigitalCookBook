/**
 * @jest-environment jsdom
 */

const { findDifficulty, changeToSelected, returnToDefault } = require('../difficulty-estimator');

beforeEach(() => {
  document.body.innerHTML = `
    <div id="theMainTag"></div>
    <div id="difficulty-form"></div>
    <input id="cookTime" value="30" />
    <input id="ingredientsNum" value="10" />
    <input id="recipeText" value="flour sugar eggs butter milk" />
    <div id="diffEasy" class="example-card"></div>
    <div id="diffMedium" class="example-card"></div>
    <div id="diffHard" class="example-card"></div>
  `;
});

test('findDifficulty calculates difficulty and updates DOM', () => {
  findDifficulty();

  // Check the calculated difficulty in the header
  const header = document.querySelector("h2");
  expect(header.textContent).toMatch(/Your Difficulty is/);

  // Check the correct difficulty class is applied
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

  // Trigger the reset
  returnToDefault();

  // Assert all classes are reset
  expect(document.getElementById("diffEasy").className).toBe("example-card");
  expect(document.getElementById("diffMedium").className).toBe("example-card");
  expect(document.getElementById("diffHard").className).toBe("example-card");
});
