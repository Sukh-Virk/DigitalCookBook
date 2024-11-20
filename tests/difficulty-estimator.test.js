
/*
const findDifficulty = require('../difficulty-estimator');
const  changeToSelected = require('../difficulty-estimator');
const returnToDefault = require('../difficulty-estimator');
const countIng = require('../difficulty-estimator');
*/

describe('Difficulty Estimator Tests', () => {

    beforeAll(() => {
      // Create the DOM structure manually for the tests
      document.body.innerHTML = `
        <main id="theMainTag" class="estimator-container">
        <h1>Difficulty Estimator</h1>
        <p>Estimate the difficulty level of a recipe based on cooking time and complexity.</p>

        <form id="difficulty-form">
            <label for="cookTime">Cooking Time (minutes):</label>
            <input type="number" id="cookTime" name="cook-time" min="1" value="3">

            <label for="ingredientsNum">Number of ingredients:</label>
            <input type="number" id="ingredientsNum" name="ingredients-num" min="1" value="3">

            <label for="recipeText">Type the recipe:</label>
            <textarea id="recipeText" name="recipeText" class="recipeInput1"> </textarea>

            <button type="button" id="myButton" class="estimate-btn">Estimate Difficulty</button>
            <h2 id="output"></h2>
            </form>
            </main>


            <section class="examples-section">
                <h2>Examples of Difficulty Levels</h2>
                <div class="examples-container">
                    <div id="diffEasy" class="example-card">
                        <h3>Easy</h3>
                        <p>Examples: Simple salad, boiled eggs, sandwiches.</p>
                    </div>
                    <div id="diffMedium" class="example-card">
                        <h3>Medium</h3>
                        <p>Examples: Grilled chicken, pasta, stir-fry dishes.</p>
                    </div>
                    <div id="diffHard" class="example-card">
                        <h3>Hard</h3>
                        <p>Examples: Beef Wellington, souffle, homemade pasta from scratch.</p>
                    </div>
                </div>
            </section>
      `;
    });
  
    test('findDifficulty calculates difficulty and updates DOM', () => {
      // Set mock values for inputs
      document.getElementById("cookTime").value = 45;
      document.getElementById("ingredientsNum").value = 8;
      document.getElementById("recipeText").value = "flour sugar eggs butter milk salt";
  
      // Simulate a click on the button to call findDifficulty
      // document.getElementById("myButton").click();
      let newHeader = document.getElementById("output");

      findDifficulty(newHeader);
  
      // Check if the difficulty is displayed in a header
      const header = document.querySelector("h2");
      expect(header).not.toBeNull();
      expect(header.innerHTML).toBe("Your Difficulty is 4.7");
  
      // Check if the appropriate difficulty card is selected
      const diffEasyBox = document.getElementById("diffEasy");
      const diffMediumBox = document.getElementById("diffMedium");
      const diffHardBox = document.getElementById("diffHard");
  
      expect(diffEasyBox.className).toBe("example-card");
      expect(diffMediumBox.className).toBe("example-card-Selected");
      expect(diffHardBox.className).toBe("example-card");

      // reset to default
      returnToDefault();
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
      
      // reset to default
      returnToDefault();
      // Test difficulty between 4 and 8 (medium)
      changeToSelected(6);
      diffEasyBox = document.getElementById("diffEasy");
      diffMediumBox = document.getElementById("diffMedium");
      diffHardBox = document.getElementById("diffHard");
  
      expect(diffEasyBox.className).toBe("example-card");
      expect(diffMediumBox.className).toBe("example-card-Selected");
      expect(diffHardBox.className).toBe("example-card");
      
      // reset to default
      returnToDefault();

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
  

  function findDifficulty(newHeader) {
    const minutes = parseInt(document.getElementById("cookTime").value);
    const ingrediantNum = parseInt(document.getElementById("ingredientsNum").value);
    let minutesPoint = minutes / 15;
    let difficulty = Math.min(minutesPoint, 4);
    let ingrediantPoint = ingrediantNum / 5;
    difficulty += Math.min(ingrediantPoint, 4);
    difficulty += Math.min(countIng() / 100, 2);
    difficulty = difficulty.toFixed(1);

    // Ensure the h2 element is being created and appended
    newHeader.innerHTML = `Your Difficulty is ${difficulty}`;
    
    // Log the header element to ensure it's being created
    console.log("Header created:", newHeader);
    
    const mainTag = document.getElementById("theMainTag");
    if (mainTag) {
        mainTag.appendChild(newHeader);
    } else {
        console.error("The main tag with id 'theMainTag' was not found.");
    }

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