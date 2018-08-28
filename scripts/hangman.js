// fetch words from dict API
let words = [];
let word = "";
let maskedWord = "";
let discoveredLetters = [];
let wrongGuesses = [];
let undiscoveredLetters = [];
let gameStatus = undefined;
const animationElement = document.getElementById("animation");
const currentWordElement = document.getElementById("currentWord");

let request = new XMLHttpRequest();
const url = "https://cors-anywhere.herokuapp.com/http://app.linkedin-reach.io/words";
request.open("GET", url, true);
request.onload = function () {
    words = request.response.split("\n");
    // get random word from words[]
    word = getRandomWord(words);
    maskedWord = word;
    console.log(word);
    // convert word into an array of unique letters
    undiscoveredLetters = uniqueChar(word);
    console.log(undiscoveredLetters);   
    // gameStatus: undefined - in game; true - win; false - game over
    gameStatus = undefined;
    
    displayMaskedWord(maskedWord, undiscoveredLetters);
    
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
                const n = wrongGuesses.length + 1;
                animationElement.classList = "animation-" + n;

                // update the number of remaining guesses
                document.getElementById("remainingGuesses").textContent = 6 - wrongGuesses.length;
                checkIfLost();
            }
            
            else { // if the guess was correct
                // mark letter as discovered
                undiscoveredLetters.splice(index, 1);
                discoveredLetters.push(letter);
    
                markLetterAsCorrect(element);                
                displayMaskedWord(maskedWord, undiscoveredLetters);
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
    animationElement.classList = "animation-1";
    currentWordElement.classList = "";
    word = getRandomWord(words);
    maskedWord = word;
    undiscoveredLetters = uniqueChar(word);
    console.log(word);
    console.log(undiscoveredLetters);
    displayMaskedWord(maskedWord, undiscoveredLetters);

    const letters = document.getElementsByClassName("letter");
    for (let i = 0; i < letters.length; i++) {        
        letters[i].classList.remove("correct");
        letters[i].classList.remove("wrong");
    }
    
    document.getElementById("gameMessage").innerHTML = "<div>Remaining guesses:</div><div id='remainingGuesses'>6</div>";
}

// get a hint
document.getElementById("hintBtn").addEventListener("click", getHint);
function getHint() {
    if (gameStatus !== undefined) {
        return;
    }
    if (undiscoveredLetters.length !== 0) {
        let index = Math.floor(Math.random() * undiscoveredLetters.length);
        let hint = undiscoveredLetters[index];
        console.log(hint);
        undiscoveredLetters.splice(index, 1);
        let element = document.getElementById(hint);
        markLetterAsCorrect(element);
        displayMaskedWord(maskedWord, undiscoveredLetters);
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
        document.getElementById("gameMessage").textContent = "You win!";
        animationElement.classList = "animation-8";
    }
}

// lost the game if guessed incorrectly for 6 times
function checkIfLost() {
    if (wrongGuesses.length === 6) {
        gameStatus = false; // game over
        document.getElementById("gameMessage").textContent = "Game over!";
        animationElement.classList = "animation-7";
        displayMaskedWord(word, undiscoveredLetters); // display the entire word in grey color
    }
}

// generate masked word and display it
function displayMaskedWord(maskedWord, undiscoveredLetters) {
    if (gameStatus === false) { // display the entire word in grey color
        currentWordElement.classList.add("failed");
    } else {
        for (let i = 0; i < undiscoveredLetters.length; i++) {
            let letter = undiscoveredLetters[i];
                // mask all undiscovered letters
                maskedWord = maskedWord.replace(new RegExp(letter, "g"), "_"); 
            }

    }

    
    document.getElementById("currentWord").textContent = maskedWord;
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

onload = function startAnimation() { 
    let frameHeight = 320; 
    let frames = 2; 
    let frame = 0; 
    let div = document.getElementById("animation"); 
    setInterval(function () { 
        let frameOffset = (++frame % frames) * -frameHeight; 
        div.style.backgroundPosition = "0px " + frameOffset + "px"; 
    }, 100); 
} 
