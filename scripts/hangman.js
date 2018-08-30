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
const gameMsgElement = document.getElementById("gameMessage");
const heartElement = document.getElementById("nHearts");
const nWinElement = document.getElementById("nWins");
const pointsElement = document.getElementById("points");
let nHearts = 3;
let nWins = 0;
let nGames = 0;
let leaderBoard = {};
let playerName = "";
let points = 0;
let leaderboardData = [];

let request = new XMLHttpRequest();
// const url = "https://cors-anywhere.herokuapp.com/http://app.linkedin-reach.io/words";
const url = "http://app.linkedin-reach.io/words"; // use this URL if already installed CORS Chrome extention
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
                points++;
                updatePoints();
                console.log(nWins, nGames, points)
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
    
    console.log("nheart = " + nHearts);
    if (nHearts === 0) {
        points = 0;
        nGames = 0;
        nWins = 0;
        nHearts = 3;
        updatePoints();
        updateHearts(nHearts);
    }

    document.getElementById("gameMessage").innerHTML = "<div>Remaining guesses:</div><div id='remainingGuesses'>6</div>";
}

// get a hint
document.getElementById("hintBtn").addEventListener("click", getHint);
function getHint() {
    console.log("gameStatus = " + gameStatus);
    if (gameStatus !== undefined) {
        return;
    }
    if (nHearts === 0) {
        window.alert("All hearts lost!");
        return;
    }
    if (!window.confirm("Use hint will lose 1 heart, do you want to continue?")) {
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
        nHearts--;
        console.log("nheart = " + nHearts);
        updateHearts(nHearts);
        checkIfWin();
    }
    return;
}

function markLetterAsCorrect(element) {
    element.classList.add("correct");
}
function updateHearts(nHearts) {
    heartElement.style.width = nHearts * 32 + "px";
}

// win the game if discovered all letters
function checkIfWin() {
    if (undiscoveredLetters.length === 0) { // if all letters were discovered               
        gameStatus = true; // you win                
        gameMsgElement.textContent = "You win!";
        animationElement.classList = "animation-8";
        displayMaskedWord(word, undiscoveredLetters);
        nWins++;
        nGames++;
        points += 10;
        updatePoints();
    }
}

// lost the game if guessed incorrectly for 6 times
function checkIfLost() {
    if (wrongGuesses.length === 6) {
        gameStatus = false; // game over
        gameMsgElement.textContent = "Game over!";
        animationElement.classList = "animation-7";
        displayMaskedWord(word, undiscoveredLetters); // display the entire word in grey color
        nGames++;
        updatePoints();
        if (nHearts !== 0) {
            nHearts--;
            console.log("nheart = " + nHearts);
            updateHearts(nHearts);
        } else {
            // TODO: pop out modal to save player name and points
            saveScores();
            playerName = "Bingjun";
            leaderboardData.push({name: playerName, score: points});
        }
    }
}

// update game points
function updatePoints() {
    nWinElement.innerHTML = "Winning: " + nWins + "/" + nGames + " games";
    pointsElement.innerHTML = points + " points";
}

// generate masked word and display it
function displayMaskedWord(maskedWord, undiscoveredLetters) {
    if (gameStatus === false) { // display the entire word in grey color
        currentWordElement.classList = "lost";
    } else if (gameStatus === true) { // display the word in green color
        currentWordElement.classList = "win";
    }
    
    else {
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
    const frameHeight = 320; 
    const frames = 2; 
    let frame = 0; 
    const div = document.getElementById("animation"); 
    setInterval(function () { 
        let frameOffset = (++frame % frames) * -frameHeight; 
        div.style.backgroundPosition = "0px " + frameOffset + "px"; 
    }, 100); 
} 

createLeaderboard();
function createLeaderboard() {
    // get the leaderboard modal
    const modal = document.getElementById("leaderboardModal");
    // get the button that opens the modal
    const btn = document.getElementById("leaderboardBtn");
    // get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];
    // get modal content
    const modalContent = document.getElementById("leaderboardContent");
    // when the user clicks on the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
        // modalContent.innerHTML = "Leader Board<br>Bingjun<br>100";
        createTable();
    }
    // when the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // when the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    // create leader board table and insert into modalContent
    function createTable() {
        let tbl = document.createElement("table");
        tbl.style.width = "100%";
        tbl.setAttribute("border", "0");
        let tbdy = document.createElement("tbody");
        const tr = document.createElement("tr");
        tr.innerHTML = "<th>Rank</th><th>Player</th><th>Score</th>";
        tbdy.appendChild(tr);
        for (let i = 0; i < 10; i++) { // display top 10 scores
            const tr = document.createElement('tr');
            const player = leaderboardData[i];
            if (player) {
                tr.innerHTML = "<td>" + (i + 1) + "</td><td>" + player.name + "</td><td>" + player.score + "</td>";
                tbdy.appendChild(tr);
            }
        }
        tbl.appendChild(tbdy);
        modalContent.innerHTML = "";
        modalContent.appendChild(tbl);
    }
}

// save player name and score to leaderboard
function saveScores(leaderboardData, points) {
    const modal = document.getElementById("playerModal");
    // const 
}