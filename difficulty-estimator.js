document.getElementById("myButton").onclick = findDifficulty;
const newDiv = document.createElement("div");
const newHeader = document.createElement("h2");
function findDifficulty() {
    const minutes = parseInt(document.getElementById("cookTime").value);
    const ingrediantNum = parseInt(document.getElementById("ingredientsNum").value);
    let minutesPoint = minutes / 15;
    let difficulty = Math.min(minutesPoint, 4);
    let ingrediantPoint = ingrediantNum / 5;
    difficulty += Math.min(ingrediantPoint, 4);
    difficulty += Math.min(countIng() / 100, 2);
    difficulty = difficulty.toFixed(1)
    newHeader.innerHTML = `Your Difficulty is ${difficulty}`
    console.log(difficulty)
    let elementToAddTo = document.getElementById("theMainTag")
    let elementToAddBefore = document.getElementById("difficulty-form")
    newDiv.appendChild(newHeader);
    elementToAddTo.insertBefore(newDiv, elementToAddBefore)
    returnToDefault();
    changeToSelected(difficulty);
}
function changeToSelected(difficulty){
    if(difficulty<4){
        let diffEasyBox = document.getElementById("diffEasy");
        diffEasyBox.className = "example-card-Selected" ;
    }else if(difficulty<8){
        let diffMediumBox = document.getElementById("diffMedium");
        diffMediumBox.className = "example-card-Selected" ;
    }else{
        let diffHardBox= document.getElementById("diffHard");
        diffHardBox.className = "example-card-Selected" ;
    }
}
function returnToDefault(){
    let diffEasyBox = document.getElementById("diffEasy");
    let diffMediumBox= document.getElementById("diffMedium");
    let diffHardBox = document.getElementById("diffHard");
    diffEasyBox.className = "example-card" ;
    diffMediumBox.className = "example-card" ;
    diffHardBox.className = "example-card" ;
}
function countIng() {
    const recipeText = document.getElementById("recipeText").value;
    return recipeText.split(" ").length
}