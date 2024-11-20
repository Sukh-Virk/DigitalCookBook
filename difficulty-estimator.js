// Difficulty Estimator (Revised Version)
function findDifficulty() {
    const newHeader = document.getElementById("output");
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
    // Reset card classes
    returnToDefault();

    if (difficulty < 4) {
        document.getElementById("diffEasy").className = "example-card-Selected";
    } else if (difficulty < 8) {
        document.getElementById("diffMedium").className = "example-card-Selected";
    } else {
        document.getElementById("diffHard").className = "example-card-Selected";
    }
}

function returnToDefault() {
    // Reset all difficulty cards to default state
    document.getElementById("diffEasy").className = "example-card";
    document.getElementById("diffMedium").className = "example-card";
    document.getElementById("diffHard").className = "example-card";
}

function countIng() {
    const recipeText = document.getElementById("recipeText").value;
    return recipeText.split(" ").length; // Count words in the recipe text
}

document.getElementById("myButton").onclick = findDifficulty;

// Export the functions for testing purposes (if needed)
module.exports = { findDifficulty, changeToSelected, returnToDefault, countIng };
