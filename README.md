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

## My thought and building process
### Why did I choose Javascript to write this game
When I got this project, the first thing I considered was which language I should choose. I am more familiar in Java programming but started learning Javascript recently because of my growing interest in front-end development and creating interesting interactions on webpages. I was very excited to have this learning opportunity to write my first Javascript project. It turned out that I had so much fun during this project!

### How did I start building it
Big problems are nothing more than a collection of little problems. Every time I got a problem, the first step is to break it down into solvable component problems that I can actually solve in reasonable time. As for the simplest version of the game, I can first break it into two main components: the core logic of the implementation and the UI. I will later break each component into even smaller ones. 

#### The core logic
This is the step where I need to represent the game by abstract concepts that can be transformed into lines of code later. I first tried to understand the core logic by going through each steps of the game. I wrote and drew the input/output and possible variables for each game operation on a piece of paper. 
1. Obtain a random word from dictionary for guessing
  - need a variable to store the word
  - need an array to store unique and undiscovered letters generated from the word
2. Obtain the guessed letter from the player
  - need a variable to store the guessed letter
3. Check if the guessed letter is one of the undiscovered letters to determine if this is a correct or wrong guess
  - take the letter out of undiscovered letters
  - store correct and wrong guesses into two arrays, separately
4. Check if the number of wrong guesses is smaller than 6
  - If yes, continue guessing next letter
    - if the letter was clicked before (either in correct array or wrong array), no action
    - if never guessed, continue to step 3
  - If no, end the game and mark as lost
5. Check if all the unique letters of the word are discovered
  - end the game and mark as win
6. If game ended, no action on clicking any letter

After sorting out the core logic, I wrote it in Javascript (hangman.js) and tested it with mock data until it yielded correct results. 

#### The UI
I first built a simple and static webpage (index.html) to display the main UI components. 
- a navbar for displaying the game title
- a section for displaying the guessing progress
- a keyboard of letters
- a section for displaying the number of remaining guesses or the game status (win or lose)
These are all the essential UI components for the game. Other components are added later when adding new features.

A CSS file (hangman.css) was created to add the styles.

After the essential UI was built, I added code to manipulate DOM elements and make the simplest version of the game alive.

### Adding features
Several features were implemented but I started with the must-have and simple ones. 
#### Request random word from the provided dictionary API
One challenge here was the cross domain data accessing. I first thought the required header for Cross-origin resource sharing (CORS) was simply missing from the API. I figured there were Chrome extentions that enables CORS. I used one of the extentions to unblock my progress. Meanwhile, I contacted the tech team to report this issue and learnt that it was part of the challenge. I then figured some other ways (e.g., adding CORS proxy) to work around it. It was fun to learn these tricks.
#### Reset the game by clicking on the "New Game" button
The interesting challenge here was the increasing complexity as new features added. It was pretty clear and easy at the begginning since the game was simple and not many variables need to be reset. As more and more new features added, many variables need to be explicitly reset and it became so cumbersome. This was one of the reasons that I decided to refactor the entire app later. I will explain that in the [OOP Refactor sections](https://github.com/bzhang/hangman-game#oop-refactor) below.
#### Get a hint by clicking on the "Hint" button
I designed this feature to add more fun to the game. Each hint unveils one correct letter. Of course hint shouldn't be unlimited so I added score and lives to make the game a lot more interesting.
#### The score system
I use hearts to represents player's lives in the game. Each player has 3 lives. Lost a game or using a hint will lose the player 1 heart. Correct guesses on letters and word will earn points. The final score is calculated when the player lost all 3 hearts.
#### The leaderboard
The leaderboard is one of the main features. The idea was to save score for each player and add to a leaderboard. Clicking on the "Leaderboard" button at any time will display the ranked players and scores. There were several fun challenges during the implementation and I learnt a lot.
- One of the UI challenges here was how to make a modal box with Javascript and CSS. I did some research and learnt how to implement that to display a pretty box each time clicking on the "Leaderboard" button and hide the box when clicking on the close button. 
- Add the updated leaderboard data to the modal box and display it correctly. I created table from the sorted leaderboard data and added it to the modal content.
- Request player name if the final score is high enough to join the leaderboard. If player decides to not share his/her name, the name will be saved as "Anonymous Player".
#### Animations to show the game progress
These are the first set of animations I have ever implemented and I think they are super cool!  
#### Small UI improvements
- Display correctly guessed letter in green color and wrongly guessed letter in red
- When game ended, display word in green color if won and in grey if lost
- Display and update the number of remianing guesses and win/lose messages
- Display and update current game scores and player's remaining lives

### OOP refactor
