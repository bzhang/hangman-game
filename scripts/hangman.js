function fetchWords(callback) {
    const request = new XMLHttpRequest();

    // use proxy to workaround CORS issue, only work in Chrome
    // if run in Safari, select the "Disable cross origin restrictions" in Develop menu
    const url = "https://cors-proxy.htmldriven.com/?url=http://app.linkedin-reach.io/words";

    // use this URL if already installed CORS Chrome extention, a lot faster than using CORS proxy
    // const url = "http://app.linkedin-reach.io/words";

    request.open("GET", url, true);
    request.onload = function () {
        // comment the following line if using CORS Chrome extention
        const httpResponse = JSON.parse(request.response).body;
        // uncomment the following line if using CORS Chrome extention
        // const httpResponse = request.response;
        const words = httpResponse.split("\n");
        callback(words);
    }
    request.send();
}

function Game() {
    const word = Game.getRandomWord();
    const undiscoveredLetters = Game.getUniqueChars(word);
    console.log("Current word is " + word);
    console.log("All unique letters = " + undiscoveredLetters);
    const discoveredLetters = [];
    const wrongGuesses = [];

    // status: undefined - in game; true - won; false - game over
    this.status = undefined;

    // check if the guess is correct or wrong
    this.checkLetter = function (letter) {

        // skip if letter has been previously guessed or game has ended
        // return undefined to indicate invalid letter input
        if (discoveredLetters.indexOf(letter) !== -1 ||
            wrongGuesses.indexOf(letter) !== -1 ||
            this.status !== undefined) {
            return undefined;
        }

        const index = undiscoveredLetters.indexOf(letter);
        if (index === -1) { // this is a wrong guess
            wrongGuesses.push(letter);
            if (wrongGuesses.length >= 6) {
                this.status = false; // game over after 6 wrong guesses
            }
            return false;
        } else { // if the guess was correct
            undiscoveredLetters.splice(index, 1);
            discoveredLetters.push(letter);
            if (undiscoveredLetters.length === 0) {
                this.status = true; // you win if all letters are discovered
            }
            return true;
        }
    };

    this.getNumWrongGuesses = function () {
        return wrongGuesses.length;
    };

    this.getMaskedWord = function () {
        let maskedWord = word;
        // only mask undiscovered letters if game is ongoing
        if (this.status === undefined) {
            for (let i = 0; i < undiscoveredLetters.length; i++) {
                let letter = undiscoveredLetters[i];
                maskedWord = maskedWord.replace(new RegExp(letter, "g"), "_");
            }
        }
        return maskedWord;
    };

    this.giveHint = function () {
        const index = Math.floor(Math.random() * undiscoveredLetters.length);
        const hint = undiscoveredLetters[index];
        this.checkLetter(hint); // update letter arrays and game status
        return hint;
    };
}

Game.wordList = [];
Game.getRandomWord = function () {
    const index = Math.floor(Math.random() * this.wordList.length);
    return this.wordList[index].toUpperCase();
}
// generate an array of unique letters from word
Game.getUniqueChars = function (word) {
    const unique = [];
    for (let i = 0; i < word.length; i++) {
        if (unique.indexOf(word.charAt(i)) === -1) { // if the character does not exist in unique
            unique.push(word[i]); // add to unique
        }
    }
    return unique;
};

function Player() {
    this.nHearts = 3;
    this.nWins = 0;
    this.nGames = 0;
    this.points = 0;
    this.registerGameStatus = function (status) {
        if (status === false) {
            this.nGames++;
            this.nHearts--;
        } else if (status === true) {
            this.nGames++;
            this.nWins++;
            this.points += 10;
        }
    };
}

const leaderboard = {
    data: JSON.parse(localStorage.getItem("leaderboardData") || "[]"),
    savePlayerScore: function (score) {
        if (this.data.length < 10 || score > this.data[9].score) {
            const name = window.prompt("Add your name to leaderboard:") || "Anonymous Player";
            const record = { name: name, score: score };
            if (this.data.length < 10) {
                this.data.push(record);
            } else {
                this.data[9] = record;
            }
            this.data.sort(function (a, b) {
                return b.score - a.score; // descending order
            });
            localStorage.setItem("leaderboardData", JSON.stringify(this.data));
        } else {
            window.alert("Play again to join the leaderboard!");
        }
    }
};

const ui = (function () { // IIFE: Immediately Invoked Function Expression
    const currentWordElement = document.getElementById("currentWord");
    const animationElement = document.getElementById("animation");
    const gameMessageTitleElement = document.getElementById("gameMessageTitle");
    const remainingGuessesElement = document.getElementById("remainingGuesses");
    const nHeartElement = document.getElementById("nHearts");
    const nWinsElement = document.getElementById("nWins");
    const pointsElement = document.getElementById("points");
    const letterElements = document.getElementsByClassName("letter");

    // access letter elements by letter
    const elementsByLetter = {};
    for (let i = 0; i < letterElements.length; i++) {
        const element = letterElements[i];
        const letter = element.textContent;
        elementsByLetter[letter] = element;
    }

    // leaderboard
    const leaderboardModal = document.getElementById("leaderboardModal");
    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const leaderboardCloseBtn = document.getElementsByClassName("close")[0];
    const leaderboardContent = document.getElementById("leaderboardContent");
    // when the user clicks on the button, open the modal
    leaderboardBtn.onclick = function() {
        leaderboardModal.style.display = "block";
        const table = createLeaderboardTable();
        leaderboardContent.innerHTML = "";
        leaderboardContent.appendChild(table);
    }
    // when the user clicks on <span> (x), close the modal
    leaderboardCloseBtn.onclick = function() {
        leaderboardModal.style.display = "none";
    }
    // when the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === leaderboardModal) {
            leaderboardModal.style.display = "none";
        }
    }
    function createLeaderboardTable() {
        const tbl = document.createElement("table");
        tbl.style.width = "100%";
        tbl.setAttribute("border", "0");
        const tbdy = document.createElement("tbody");
        tbl.appendChild(tbdy);
        const tr = document.createElement("tr");
        tr.innerHTML = "<th>Rank</th><th>Player</th><th>Score</th>";
        tbdy.appendChild(tr);
        for (let i = 0; i < leaderboard.data.length; i++) { // display top 10 scores
            const player = leaderboard.data[i];
            const tr = document.createElement('tr');
            tr.innerHTML = "<td>" + (i + 1) + "</td><td>" + player.name + "</td><td>" + player.score + "</td>";
            tbdy.appendChild(tr);
        }
        return tbl;
    }

    return {
        resetLetters: function () {
            for (let i = 0; i < letterElements.length; i++) {
                letterElements[i].classList.remove("correct");
                letterElements[i].classList.remove("wrong");
            }
        },
        markLetterAsWrong: function (letter) {
            elementsByLetter[letter].classList.add("wrong");
        },
        markLetterAsCorrect: function (letter) {
            elementsByLetter[letter].classList.add("correct");
        },
        updateGameStatus: function (game) {
            if (game.status === true) {
                gameMessageTitleElement.textContent = "You win!";
                remainingGuessesElement.textContent = "";
                animationElement.classList = "animation-7";
                currentWordElement.classList = "win";
            } else if (game.status === false) {
                gameMessageTitleElement.textContent = "Game over!";
                remainingGuessesElement.textContent = "";
                animationElement.classList = "animation-6";
                currentWordElement.classList = "lost";
            } else {
                const nWrongGuesses = game.getNumWrongGuesses();
                gameMessageTitleElement.textContent = "Remaining guesses:";
                remainingGuessesElement.textContent = 6 - nWrongGuesses;
                animationElement.classList = "animation-" + nWrongGuesses;
                currentWordElement.classList = "";
            }
            currentWordElement.textContent = game.getMaskedWord();
        },
        updatePlayerStatus: function (player) {
            nWinsElement.textContent = "You won " + player.nWins + "/" + player.nGames + " games";
            pointsElement.textContent = player.points + " points";
            nHeartElement.style.width = player.nHearts * 32 + "px"; 
        }
    };
})();

fetchWords(function (wordList) {
    Game.wordList = wordList;
    let game = new Game();
    let player = new Player();
    ui.updateGameStatus(game);

    const elements = document.getElementsByClassName("letter");
    // listen to click event for each letter
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const letter = element.textContent;
        element.addEventListener("click", function () {
            const result = game.checkLetter(letter);
            if (result === true) {
                ui.markLetterAsCorrect(letter);
                player.points++;
                ui.updatePlayerStatus(player);
            } else if (result === false) {
                ui.markLetterAsWrong(letter);
            } else {
                return;
            }
            ui.updateGameStatus(game);
            player.registerGameStatus(game.status);
            ui.updatePlayerStatus(player);
            if (game.status !== undefined && player.nHearts <= 0) {
                // use setTimeout to reflow the UI before prompt for player name
                window.setTimeout(function () {
                    leaderboard.savePlayerScore(player.points);
                }, 5);
            }
        });
    }

    document.getElementById("hintBtn").addEventListener("click", function () {
        // only give hint if game is ongoing
        if (game.status !== undefined) return;
        if (player.nHearts <= 0) {
            window.alert("All hearts lost!");
            return;
        }
        if (!window.confirm("Using hint will lose 1 heart. Do you want to continue?")) {
            return;
        }
        const letter = game.giveHint();
        ui.markLetterAsCorrect(letter);
        ui.updateGameStatus(game);
        player.nHearts--;
        ui.updatePlayerStatus(player);
    });

    document.getElementById("resetBtn").addEventListener("click", function () {
        if (player.nHearts <= 0) {
            player = new Player();
            ui.updatePlayerStatus(player);
        }
        game = new Game();
        ui.resetLetters();
        ui.updateGameStatus(game);
    });
});

onload = function startAnimation() {
    const frameHeight = 320;
    const frames = 2;
    let frame = 0;
    const div = document.getElementById("animation");
    setInterval(function () {
        const frameOffset = (++frame % frames) * -frameHeight;
        div.style.backgroundPosition = "0px " + frameOffset + "px";
    }, 100);
}
