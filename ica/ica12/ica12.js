let current = {
    question: "",
    answer: ""
}

var qButton = document.querySelector('#js-new-quote').addEventListener("click", getQuote);
var aButton = document.querySelector('#js-tweet').addEventListener("click", displayAnswer);

var endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

async function getQuote() {
    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw Error(response.statusText);
        }

        const json = await response.json();
        current.question = json.question;
        current.answer = json.answer;
        
        displayQuote(json.question);

        clearAnswer();

        console.log(json);

    } catch(err) {
        console.log(err);
        alert("Fail");
    }
}

function displayQuote(quote) {
    const quoteText = document.querySelector('#js-quote-text');
    quoteText.textContent = quote;
}

function displayAnswer() {
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = current.answer;
}

function clearAnswer() {
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = ""; // Clear the previous answer
}

getQuote();