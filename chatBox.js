// Difficulty Estimator (Revised Version)
// function findDifficulty() {
//     const newHeader = document.getElementById("output");
//     const minutes = parseInt(document.getElementById("cookTime").value);
//     const ingrediantNum = parseInt(document.getElementById("ingredientsNum").value);
//     let minutesPoint = minutes / 15;
//     let difficulty = Math.min(minutesPoint, 4);
//     let ingrediantPoint = ingrediantNum / 5;
//     difficulty += Math.min(ingrediantPoint, 4);
//     difficulty += Math.min(countIng() / 100, 2);
//     difficulty = difficulty.toFixed(1);

//     // Ensure the h2 element is being created and appended
//     newHeader.innerHTML = `Your Difficulty is ${difficulty}`;
    
//     // Log the header element to ensure it's being created
//     console.log("Header created:", newHeader);
    
//     const mainTag = document.getElementById("theMainTag");
//     if (mainTag) {
//         mainTag.appendChild(newHeader);
//     } else {
//         console.error("The main tag with id 'theMainTag' was not found.");
//     }

//     returnToDefault();
//     changeToSelected(difficulty);
// }



// function changeToSelected(difficulty) {
//     // Reset card classes
//     returnToDefault();

//     if (difficulty < 4) {
//         document.getElementById("diffEasy").className = "example-card-Selected";
//     } else if (difficulty < 8) {
//         document.getElementById("diffMedium").className = "example-card-Selected";
//     } else {
//         document.getElementById("diffHard").className = "example-card-Selected";
//     }
// }

// function returnToDefault() {
//     // Reset all difficulty cards to default state
//     document.getElementById("diffEasy").className = "example-card";
//     document.getElementById("diffMedium").className = "example-card";
//     document.getElementById("diffHard").className = "example-card";
// }

// function countIng() {
//     const recipeText = document.getElementById("recipeText").value;
//     return recipeText.split(" ").length; // Count words in the recipe text
// }

// document.getElementById("myButton").onclick = findDifficulty;

// // Export the functions for testing purposes (if needed)
// module.exports = { findDifficulty, changeToSelected, returnToDefault, countIng };

const apiKey = "501bf7b308cb4c2f94610872514d6993";

document.getElementById("input-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const userInput = document.getElementById("inputBox").value.trim();
    if (!userInput) {
        alert("Please enter some ingredients.");
        return;
    }

    // Show the loading spinner
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("hidden");

    //const ingredients = ingredientsInput.split(",").map((ing) => ing.trim().toLowerCase());
    const apiUrl = `https://api.spoonacular.com/food/converse?text=${userInput}&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    console.error("API Error:", err);
                    throw new Error(err.message || "Failed to fetch recipes.");
                });
            }
            return response.json();
        })
        .then((data) => {
            displayResult(data);
            console.log(data);
        })
        .catch((error) => {
            console.error("Fetch Error:", error);
            alert(`An error occurred: ${error.message}`);
        })
        .finally(() => {
            // Hide the loading spinner after fetching data
            loadingSpinner.classList.add("hidden");
        });
});

async function displayResult(data){
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    if(!data.media?.length){
        resultDiv.innerHTML = `<div class="responceText"> Responce: </div>
                           <div>${data.answerText}`; 
    }else{       
        resultDiv.innerHTML = `<div class="responceText"> Responce: </div><br>
                           ${data.answerText}`;
        data.media.forEach(element => {
            const resultDivTemp = document.createElement("div");
            resultDivTemp.className = "resultDivTemp";
            resultDivTemp.innerHTML += `<br><div class="titleDiv"><strong>Title</strong>: ${element.title} </div>
                                    </br><div class="linkDiv"> <a href=${element.link}" target="_blank">View recipe -></div></a>`;

            resultDiv.appendChild(resultDivTemp);
        });
    }
    
}