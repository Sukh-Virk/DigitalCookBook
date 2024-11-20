// document.getElementById("myButton").onclick = findDifficulty;
// const newDiv = document.createElement("div");
// const newHeader = document.createElement("h2");
// function findDifficulty() {
//     const minutes = parseInt(document.getElementById("cookTime").value);
//     const ingrediantNum = parseInt(document.getElementById("ingredientsNum").value);
//     let minutesPoint = minutes / 15;
//     let difficulty = Math.min(minutesPoint, 4);
//     let ingrediantPoint = ingrediantNum / 5;
//     difficulty += Math.min(ingrediantPoint, 4);
//     difficulty += Math.min(countIng() / 100, 2);
//     difficulty = difficulty.toFixed(1)
//     newHeader.innerHTML = `Your Difficulty is ${difficulty}`
//     console.log(difficulty)
//     let elementToAddTo = document.getElementById("theMainTag")
//     let elementToAddBefore = document.getElementById("difficulty-form")
//     newDiv.appendChild(newHeader);
//     elementToAddTo.insertBefore(newDiv, elementToAddBefore)
//     returnToDefault();
//     changeToSelected(difficulty);
// }
// function changeToSelected(difficulty){
//     if(difficulty<4){
//         let diffEasyBox = document.getElementById("diffEasy");
//         diffEasyBox.className = "example-card-Selected" ;
//     }else if(difficulty<8){
//         let diffMediumBox = document.getElementById("diffMedium");
//         diffMediumBox.className = "example-card-Selected" ;
//     }else{
//         let diffHardBox= document.getElementById("diffHard");
//         diffHardBox.className = "example-card-Selected" ;
//     }
// }
// function returnToDefault(){
//     let diffEasyBox = document.getElementById("diffEasy");
//     let diffMediumBox= document.getElementById("diffMedium");
//     let diffHardBox = document.getElementById("diffHard");
//     diffEasyBox.className = "example-card" ;
//     diffMediumBox.className = "example-card" ;
//     diffHardBox.className = "example-card" ;
// }
// function countIng() {
//     const recipeText = document.getElementById("recipeText").value;
//     return recipeText.split(" ").length
// }



// Difficulty Estimator (Revised Version)
let newDiv = document.createElement("div");
let newHeader = document.createElement("h2");

function findDifficulty() {
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
