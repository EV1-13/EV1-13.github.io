let current = {
    setup: "",
    delivery: ""
}

var qButton = document.querySelector('#jokeNew').addEventListener("click", getJoke);
var aButton = document.querySelector('#jokeAnswer').addEventListener("click", displayAnswer);

const audio = new Audio("laugh-1-242067.mp3");
const buttons = document.querySelectorAll("button");

var endpoint = "https://v2.jokeapi.dev/joke/Any?safe-mode&type=twopart";

async function getJoke() {
    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw Error(response.statusText);
        }

        const json = await response.json();
        current.setup = json.setup;
        current.delivery = json.delivery;
        
        displayJoke(json.setup);

        clearAnswer();

        console.log(json);

    } catch(err) {
        console.log(err);
        alert("Fail");
    }
}

function displayJoke(quote) {
    const quoteText = document.querySelector('#jokeText');
    quoteText.textContent = quote;
}

function displayAnswer() {
    const answerText = document.querySelector('#jokeAnswerText');
    answerText.textContent = current.delivery;
    audio.play();
}

function clearAnswer() {
    const answerText = document.querySelector('#jokeAnswerText');
    answerText.textContent = "";
}

getJoke();