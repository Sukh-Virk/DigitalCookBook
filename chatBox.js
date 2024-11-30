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