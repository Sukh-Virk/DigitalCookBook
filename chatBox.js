// API key for accessing the Spoonacular API
const apiKey = "501bf7b308cb4c2f94610872514d6993";

// Add an event listener to the form to handle submissions
document.getElementById("input-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the user input from the input box
    const userInputWidget = document.getElementById("inputBox");
    const userInput = userInputWidget.value.trim(); // Trim whitespace from the input

    // Check if the input is empty and alert the user if necessary
    if (!userInput) {
        alert("Please enter some ingredients.");
        return; // Exit the function early if no input is provided
    }

    // Clear the input box after submission
    userInputWidget.value = "";

    // Show the loading spinner to indicate data is being fetched
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("hidden");

    // Construct the API URL with the user input and API key
    const apiUrl = `https://api.spoonacular.com/food/converse?text=${userInput}&apiKey=${apiKey}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then((response) => {
            // Check if the response is not OK and handle errors
            if (!response.ok) {
                return response.json().then((err) => {
                    console.error("API Error:", err); // Log the API error
                    throw new Error(err.message || "Failed to fetch recipes."); // Throw an error with a message
                });
            }
            return response.json(); // Parse the response as JSON
        })
        .then((data) => {
            // Display the result in the DOM
            displayResult(data);
            console.log(data); // Log the data for debugging
        })
        .catch((error) => {
            // Handle errors during the fetch or processing
            console.error("Fetch Error:", error); // Log the fetch error
            alert(`An error occurred: ${error.message}`); // Show an error message to the user
        })
        .finally(() => {
            // Hide the loading spinner once the operation is complete
            loadingSpinner.classList.add("hidden");
        });
});

// Function to display the API response in the DOM
async function displayResult(data) {
    const resultDiv = document.getElementById("result"); // Get the result container
    resultDiv.innerHTML = ""; // Clear any existing content

    // Check if the response contains media
    if (!data.media?.length) {
        // If no media is present, display the answer text only
        resultDiv.innerHTML = `<div class="responceText"> Response: </div>
                               <div>${data.answerText}</div>`;
    } else {
        // If media is present, display the answer text and media details
        resultDiv.innerHTML = `<div class="responceText"> Response: </div><br>
                               ${data.answerText}`;
        data.media.forEach((element) => {
            // Create a container for each media item
            const resultDivTemp = document.createElement("div");
            resultDivTemp.className = "resultDivTemp"; // Add a class for styling

            // Add the media item's title and link to the container
            resultDivTemp.innerHTML += `<br>
                                        <div class="titleDiv"><strong>Title</strong>: ${element.title}</div>
                                        <br>
                                        <div class="linkDiv">
                                            <a href="${element.link}" target="_blank">View recipe -></a>
                                        </div>`;

            // Append the media container to the result container
            resultDiv.appendChild(resultDivTemp);
        });
    }
    
}