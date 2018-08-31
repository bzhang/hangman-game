# Bingjun's word guessing game

## How to run the game
To play the game, simply clone or download the source code to your computer. Open index.html in a web browser and start playing!

### Game rules
1. Game starts with a set of underscores that represents an undiscovered word. Click on any letter to make a guess. 
2. Correct guesses are marked in green color and unveiled in the undiscovered word. Wrong guesses are shown in red color.
3. Each correct letter guess earns the player 1 point. Correctly guessed one word earns the player 10 points.
4. The player loses the current game if guessed incorrectly for 6 times.
5. Click on the "New Game" button to guess a new word.
5. Each player has 3 lives that are represented by red hearts in the game. Losing 1 game will lose the player 1 heart. 
6. The player can use hint by click on the "hint" button to help guessing one letter at each time. But using a hint will lose the player 1 heart.
7. The game ended for each player when all hearts are lost. 
8. If the final score is one of the top 10 scores, the player can add his/her name to join the leaderboard. If name is not provided, the player will be logged as "Anonymous Player".
8. Leaderboard can be checked any time during the game by clicking on the "Leaderboard" button.

## For faster dictionary loading at the start
The entire dictionary is loaded at each refresh of the webpage, which takes several seconds. Clicking on the "new game" button will not refresh the webpage so there will be no waiting time for that.

The dictionary API does not allow cross domain access. There are at least 3 ways to work around it.

1. The current code is using a CORS proxy (https://cors-proxy.htmldriven.com) to work around it. 

Within the several proxies I have tested, this one does not require HTTP header so it will work in both Chrome and Safari but slightly slower in Chrome than in Safari.

2. Another proxy (https://cors-anywhere.herokuapp.com) is a lot faster but only works in Chrome. 
To use it, please comment these lines of code.
```javascript
const url = "https://cors-proxy.htmldriven.com/?url=http://app.linkedin-reach.io/words";
const httpResponse = JSON.parse(request.response).body;
```
And uncomment these.
```javascript
// const url = "https://cors-anywhere.herokuapp.com/http://app.linkedin-reach.io/words";
// const httpResponse = request.response;
```

3. The fastest way to work around it is to install Chrome extentions that can disable CORS. There are several extentions serve that. The one I'm using is called "Allow-Control-Allow-Origin: *" offered by vitvad. This method will load the dictionary rapidly but only work in Chrome.

## My thought process
