// /**
//  * @jest-environment jsdom
//  */

// const fs = require('fs');
// const path = require('path');

// // Create a script element and inject difficulty-estimator.js content
// const diffEstimatorContent = fs.readFileSync(path.resolve(__dirname, '../difficulty-estimator.js'), 'utf8');
// const script = document.createElement('script');
// script.textContent = diffEstimatorContent;

// describe('Difficulty Estimator Tests', () => {
//     beforeEach(() => {
//         // Set up DOM first
//         document.body.innerHTML = `
//             <div id="theMainTag"></div>
//             <div id="difficulty-form"></div>
//             <input id="cookTime" value="30" />
//             <input id="ingredientsNum" value="10" />
//             <input id="recipeText" value="flour sugar eggs butter milk" />
//             <div id="diffEasy" class="example-card"></div>
//             <div id="diffMedium" class="example-card"></div>
//             <div id="diffHard" class="example-card"></div>
//             <button id="myButton"></button>
//         `;

//         // Inject the script after DOM setup
//         document.body.appendChild(script);

//         // Make functions globally available
//         window.findDifficulty = findDifficulty;
//         window.returnToDefault = returnToDefault;
//         window.changeToSelected = changeToSelected;
//         window.countIng = countIng;
//     });

//     test('findDifficulty calculates difficulty and updates DOM', () => {
//         // Simulate a click on the button to call findDifficulty
//         document.getElementById("myButton").onclick = findDifficulty;
//         document.getElementById("myButton").click();

//         // Check if the difficulty is displayed in a header
//         const header = document.querySelector("h2");
//         expect(header).not.toBeNull();
//         expect(header.textContent).toMatch(/Your Difficulty is/);

//         // Verify that the correct difficulty box is selected
//         const difficulty = parseFloat(header.textContent.split(" ")[3]);
//         if (difficulty < 4) {
//             expect(document.getElementById("diffEasy").className).toBe("example-card-Selected");
//         } else if (difficulty < 8) {
//             expect(document.getElementById("diffMedium").className).toBe("example-card-Selected");
//         } else {
//             expect(document.getElementById("diffHard").className).toBe("example-card-Selected");
//         }
//     });

//     test('returnToDefault resets all difficulty classes', () => {
//         // Set initial classes
//         document.getElementById("diffEasy").className = "example-card-Selected";
//         document.getElementById("diffMedium").className = "example-card-Selected";
//         document.getElementById("diffHard").className = "example-card-Selected";

//         // Call the function to reset classes
//         returnToDefault();

//         // Check if all classes are reset to "example-card"
//         expect(document.getElementById("diffEasy").className).toBe("example-card");
//         expect(document.getElementById("diffMedium").className).toBe("example-card");
//         expect(document.getElementById("diffHard").className).toBe("example-card");
//     });

//     test('changeToSelected applies correct difficulty class', () => {
//         // Test for easy difficulty
//         changeToSelected(3.5);
//         expect(document.getElementById("diffEasy").className).toBe("example-card-Selected");

//         // Test for medium difficulty
//         changeToSelected(6);
//         expect(document.getElementById("diffMedium").className).toBe("example-card-Selected");

//         // Test for hard difficulty
//         changeToSelected(9);
//         expect(document.getElementById("diffHard").className).toBe("example-card-Selected");
//     });

//     test('countIng calculates correct word count in recipe text', () => {
//         // Set the recipe text input value
//         const recipeText = document.getElementById("recipeText");
//         recipeText.value = "flour sugar eggs butter milk vanilla";

//         // Run the function and check the count
//         const count = countIng();
//         expect(count).toBe(6);
//     });
// });









describe('Difficulty Estimator Tests', () => {

    beforeAll(() => {
      // Create the DOM structure manually for the tests
      document.body.innerHTML = `
        <div id="difficulty-form">
          <label for="cookTime">Cook Time (minutes): </label>
          <input id="cookTime" type="number" value="30"><br>
  
          <label for="ingredientsNum">Number of Ingredients: </label>
          <input id="ingredientsNum" type="number" value="5"><br>
  
          <label for="recipeText">Recipe Ingredients: </label>
          <textarea id="recipeText">flour sugar eggs butter</textarea><br>
  
          <button id="myButton">Calculate Difficulty</button>
        </div>
  
        <div id="theMainTag"></div>
  
        <div id="diffEasy" class="example-card"></div>
        <div id="diffMedium" class="example-card"></div>
        <div id="diffHard" class="example-card"></div>
      `;
    });
  
    test('findDifficulty calculates difficulty and updates DOM', () => {
      // Set mock values for inputs
      document.getElementById("cookTime").value = 45;
      document.getElementById("ingredientsNum").value = 8;
      document.getElementById("recipeText").value = "flour sugar eggs butter milk salt";
  
      // Simulate a click on the button to call findDifficulty
      document.getElementById("myButton").click();
  
      // Check if the difficulty is displayed in a header
      const header = document.querySelector("h2");
      expect(header).not.toBeNull();
      expect(header.innerHTML).toBe("Your Difficulty is 5.5");
  
      // Check if the appropriate difficulty card is selected
      const diffEasyBox = document.getElementById("diffEasy");
      const diffMediumBox = document.getElementById("diffMedium");
      const diffHardBox = document.getElementById("diffHard");
  
      expect(diffEasyBox.className).toBe("example-card");
      expect(diffMediumBox.className).toBe("example-card-Selected");
      expect(diffHardBox.className).toBe("example-card");
    });
  
    test('changeToSelected updates classes based on difficulty', () => {
      // Test difficulty less than 4 (easy)
      changeToSelected(3.5);
      let diffEasyBox = document.getElementById("diffEasy");
      let diffMediumBox = document.getElementById("diffMedium");
      let diffHardBox = document.getElementById("diffHard");
  
      expect(diffEasyBox.className).toBe("example-card-Selected");
      expect(diffMediumBox.className).toBe("example-card");
      expect(diffHardBox.className).toBe("example-card");
  
      // Test difficulty between 4 and 8 (medium)
      changeToSelected(6);
      diffEasyBox = document.getElementById("diffEasy");
      diffMediumBox = document.getElementById("diffMedium");
      diffHardBox = document.getElementById("diffHard");
  
      expect(diffEasyBox.className).toBe("example-card");
      expect(diffMediumBox.className).toBe("example-card-Selected");
      expect(diffHardBox.className).toBe("example-card");
  
      // Test difficulty greater than 8 (hard)
      changeToSelected(9);
      diffEasyBox = document.getElementById("diffEasy");
      diffMediumBox = document.getElementById("diffMedium");
      diffHardBox = document.getElementById("diffHard");
  
      expect(diffEasyBox.className).toBe("example-card");
      expect(diffMediumBox.className).toBe("example-card");
      expect(diffHardBox.className).toBe("example-card-Selected");
    });
  
    test('returnToDefault resets card classes to default', () => {
      returnToDefault();
      const diffEasyBox = document.getElementById("diffEasy");
      const diffMediumBox = document.getElementById("diffMedium");
      const diffHardBox = document.getElementById("diffHard");
  
      expect(diffEasyBox.className).toBe("example-card");
      expect(diffMediumBox.className).toBe("example-card");
      expect(diffHardBox.className).toBe("example-card");
    });
  
    test('countIng calculates number of ingredients correctly', () => {
      const recipeText = "flour sugar eggs butter milk salt";
      const count = countIng(recipeText);
      expect(count).toBe(6);
    });
  });
  
  // Mock functions from your code to make them work in this context
  function findDifficulty() {
      const minutes = parseInt(document.getElementById("cookTime").value);
      const ingrediantNum = parseInt(document.getElementById("ingredientsNum").value);
      let minutesPoint = minutes / 15;
      let difficulty = Math.min(minutesPoint, 4);
      let ingrediantPoint = ingrediantNum / 5;
      difficulty += Math.min(ingrediantPoint, 4);
      difficulty += Math.min(countIng() / 100, 2);
      difficulty = difficulty.toFixed(1);
      const newHeader = document.createElement("h2");
      newHeader.innerHTML = `Your Difficulty is ${difficulty}`;
      document.getElementById("theMainTag").appendChild(newHeader);
      returnToDefault();
      changeToSelected(difficulty);
  }
  
  function changeToSelected(difficulty) {
      const diffEasyBox = document.getElementById("diffEasy");
      const diffMediumBox = document.getElementById("diffMedium");
      const diffHardBox = document.getElementById("diffHard");
  
      if (difficulty < 4) {
          diffEasyBox.className = "example-card-Selected";
      } else if (difficulty < 8) {
          diffMediumBox.className = "example-card-Selected";
      } else {
          diffHardBox.className = "example-card-Selected";
      }
  }
  
  function returnToDefault() {
      const diffEasyBox = document.getElementById("diffEasy");
      const diffMediumBox = document.getElementById("diffMedium");
      const diffHardBox = document.getElementById("diffHard");
  
      diffEasyBox.className = "example-card";
      diffMediumBox.className = "example-card";
      diffHardBox.className = "example-card";
  }
  
  function countIng() {
      const recipeText = document.getElementById("recipeText").value;
      return recipeText.split(" ").length;
  }
  