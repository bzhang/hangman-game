// TODO: capitalize the letters obtained from dict API
const undiscoveredLetters = ["W", "O", "R", "D"];
const discoveredLetters = [];
const wrongGuesses = [];
let gameResult = undefined;

const elements = document.getElementsByClassName("letter");
for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.addEventListener("click", function () {
        const typedLetter = element.textContent; 
        if (discoveredLetters.indexOf(typedLetter) !== -1 || 
            wrongGuesses.indexOf(typedLetter) !== -1 || 
            gameResult === true ||
            gameResult === false) {
            return;
        }
        const index = undiscoveredLetters.indexOf(typedLetter);
        if (index === -1) {
            wrongGuesses.push(typedLetter);
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
            console.log(discoveredLetters);
            if (undiscoveredLetters.length === 0) {
                gameResult = true;
                console.log("You win!");
            }
        }
    });
    

}
// document.addEventListener