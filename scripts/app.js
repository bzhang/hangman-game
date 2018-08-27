// TODO: capitalize the letters obtained from dict API
let word = "CORRECT";
const undiscoveredLetters = ["C", "O", "R", "E", "T"];
const discoveredLetters = [];
const wrongGuesses = [];
// gameResult: undefined - in game; true - win; false - lose
let gameResult = undefined;

displayMaskedWord(word, undiscoveredLetters);
const elements = document.getElementsByClassName("letter");
// listen to click event for each letter in keyboard
for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.addEventListener("click", function () {
        const typedLetter = element.textContent; 
        if (discoveredLetters.indexOf(typedLetter) !== -1 || // check if typedLetter in discoveredLetters array
            wrongGuesses.indexOf(typedLetter) !== -1 || // check if typedLetter in wrongGuesses array
            gameResult === true || // check if already win
            gameResult === false) { // check if already lose
            return; // return if the letter has been clicked or the game ended
        }
        const index = undiscoveredLetters.indexOf(typedLetter);
        if (index === -1) { // if the guess was wrong
            wrongGuesses.push(typedLetter); // add to typedLetter array
            element.classList.add("wrong"); // add class name "wrong" to the element
            // Decrease the number of remaining guesses by 1
            document.getElementById("remainingGuesses").textContent -= 1; 
            console.log(wrongGuesses);
            if (wrongGuesses.length === 6) { // if guessed incorrectly for 6 times
                gameResult = false;
                console.log("You lose!");
                // display lose message
                document.getElementById("hangman").textContent = "You lose!";
            }
        } else { // if the guess was correct
            undiscoveredLetters.splice(index, 1); // remove from undiscoveredLetters
            console.log(undiscoveredLetters);
            discoveredLetters.push(typedLetter); // add to typedLetters
            element.classList.add("correct"); // add class name "correct" to the element
            displayMaskedWord(word, undiscoveredLetters);
            if (undiscoveredLetters.length === 0) { // if all letters were discovered               
                gameResult = true;
                console.log("You win!");
                // display win message;
                document.getElementById("hangman").textContent = "You win!";
            }
        }        
    });
}

function displayMaskedWord(word, undiscoveredLetters) {
    for (let i = 0; i < undiscoveredLetters.length; i++) {
        let letter = undiscoveredLetters[i];
        // use regexp to replace all occurances of letter with underscores
        word = word.replace(new RegExp(letter, 'g'), "_"); 
    }
    // display the masked word
    document.getElementById("currentWord").textContent = word;
}