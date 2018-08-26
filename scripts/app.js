// TODO: capitalize the letters obtained from dict API
let word = "CORRECT";
const undiscoveredLetters = ["C", "O", "R", "E", "T"];
const discoveredLetters = [];
const wrongGuesses = [];
// gameResult: undefined - in game; true - win; false - lose
let gameResult = undefined;

const elements = document.getElementsByClassName("letter");
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
        if (index === -1) {
            wrongGuesses.push(typedLetter);
            element.classList.add("wrong");
            console.log(wrongGuesses);
            if (wrongGuesses.length === 6) {
                // TODO: wire to UI
                gameResult = false;
                console.log("You lose!");
            }
        } else {
            undiscoveredLetters.splice(index, 1);
            console.log(undiscoveredLetters);
            discoveredLetters.push(typedLetter);
            element.classList.add("correct");
            let display = word;
            for (let i = 0; i < undiscoveredLetters.length; i++) {
                let letter = undiscoveredLetters[i];
                // console.log(letter);
                display = display.replace(new RegExp(letter, 'g'), "_"); // use regex to replace all occurance of letter                
            }
            
            console.log(discoveredLetters);
            if (undiscoveredLetters.length === 0) {                
                gameResult = true;
                console.log("You win!");
            }
            console.log(display);
        }        
    });
    

}
// document.addEventListener