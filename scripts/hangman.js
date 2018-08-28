// fetch words from dict API
let words = [];
let word = "";
let discoveredLetters = [];
let wrongGuesses = [];
let undiscoveredLetters = [];
let gameStatus = undefined;

let request = new XMLHttpRequest();
const url = "https://cors-anywhere.herokuapp.com/http://app.linkedin-reach.io/words";
request.open("GET", url, true);
request.onload = function () {
    words = request.response.split("\n");
    // get random word from words[]
    word = getRandomWord(words);
    console.log(word);
    // convert word into an array of unique letters
    undiscoveredLetters = uniqueChar(word);
    console.log(undiscoveredLetters);   
    // gameStatus: undefined - in game; true - win; false - game over
    gameStatus = undefined;
    
    displayMaskedWord(word, undiscoveredLetters);
    
    const elements = document.getElementsByClassName("letter");
    // listen to click event for each letter
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const letter = element.textContent; 
        element.addEventListener("click", function () {
    
            if (discoveredLetters.indexOf(letter) !== -1 || // check if letter is discovered
                wrongGuesses.indexOf(letter) !== -1 || // check if letter has been wrongly guessed
                gameStatus !== undefined) { // check if game ended
                return; // skip click event handling
            }
    
            const index = undiscoveredLetters.indexOf(letter);
    
            if (index === -1) { // if the guess was wrong
                wrongGuesses.push(letter); // mark the letter as a wrong guess
                element.classList.add("wrong");
                // update the number of remaining guesses
                document.getElementById("remainingGuesses").textContent = 6 - wrongGuesses.length;
                if (wrongGuesses.length === 6) {
                    gameStatus = false; // game over
                    document.getElementById("hangman").textContent = "Game over!";
                }
            }
            
            else { // if the guess was correct
                // mark letter as discovered
                undiscoveredLetters.splice(index, 1);
                discoveredLetters.push(letter);
    
                markLetterAsCorrect(element);                
                displayMaskedWord(word, undiscoveredLetters);
                checkIfWin();
            }
        });
    }    
}
request.send();

// reset the game
document.getElementById("resetBtn").addEventListener("click", resetGame);
function resetGame() {
    gameStatus = undefined;
    discoveredLetters = [];
    wrongGuesses = [];
    word = getRandomWord(words);
    undiscoveredLetters = uniqueChar(word);
    console.log(word);
    console.log(undiscoveredLetters);
    displayMaskedWord(word, undiscoveredLetters);

    const letters = document.getElementsByClassName("letter");
    for (let i = 0; i < letters.length; i++) {        
        letters[i].classList.remove("correct");
        letters[i].classList.remove("wrong");
    }
    
    document.getElementById("hangman").innerHTML = "<div>Remaining guesses:</div><div id='remainingGuesses'>6</div>";
}

// get a hint
document.getElementById("hintBtn").addEventListener("click", getHint);
function getHint() {
    if (undiscoveredLetters.length !== 0) {
        let hint = undiscoveredLetters.pop();
        let element = document.getElementById(hint);
        markLetterAsCorrect(element);
        displayMaskedWord(word, undiscoveredLetters);
        discoveredLetters.push(hint);
        checkIfWin();
    }
}

function markLetterAsCorrect(element) {
    element.classList.add("correct");
}

// win the game if discovered all letters
function checkIfWin() {
    if (undiscoveredLetters.length === 0) { // if all letters were discovered               
        gameStatus = true; // you win                
        document.getElementById("hangman").textContent = "You win!";
    }
}

// generate masked word and display it
function displayMaskedWord(word, undiscoveredLetters) {
    for (let i = 0; i < undiscoveredLetters.length; i++) {
        let letter = undiscoveredLetters[i];
        // mask all undiscovered letters
        word = word.replace(new RegExp(letter, "g"), "_"); 
    }
    document.getElementById("currentWord").textContent = word;
}

// generate an array of unique letters from word
function uniqueChar(string) {
    let unique=[];
    for (let i = 0; i < string.length; i++) {
        if (unique.indexOf(string.charAt(i)) === -1) { // if the character does not exist in unique 
            unique.push(string[i]); // add to unique
        }
    }
    return unique;  
}

function getRandomWord(words) {
    const rand = Math.floor(Math.random() * words.length);
    return words[rand].toUpperCase();
}