# Bingjun's Word Guessing Game

## How to run the game

To play the game, simply clone or download the source code to your computer. Open index.html in a web browser (Chrome recommended) and start playing! 

If play in Safari, please check the "Disable Cross-Origin Restrictions" option in the Develop menu.

For easier testing and debugging, the correct word will be logged into the console. You can check it in the Console panel in Developer Tools. In Chrome, open Console panel from the menu View - Developer - Developer Tools or press keyboard shortcut Option + Command + I. 

### Game rules

1. Game starts with a set of underscores that represents an undiscovered word. Click on any letter to make a guess. 
2. Correct guesses are marked in green color and unveiled in the undiscovered word. Wrong guesses are shown in red color.
3. Each correct letter guess earns the player 1 point. Correctly guessing one whole word earns the player 10 points.
4. The player loses the current game if he/she guesses incorrectly for 6 times.
5. Click on the "New Game" button to restart with a new word.
6. Each player has 3 lives that are represented by red hearts in the UI. Each lost game takes 1 heart away.
7. The player can ask for a hint by click on the "Hint" button, which guarentees a correct guess. But it also takes 1 heart.
8. The game ends for the player when all hearts are lost. 
9. If the final score is one of the top 10, the player can add his/her name to join the leaderboard. If name is not provided, the score will be recorded as from "Anonymous Player".
10. Leaderboard can be displayed at any time during the game by clicking on the "Leaderboard" button.

### For faster dictionary loading at the start

The entire dictionary is loaded from remote server every time the page refreshes, and it takes several seconds. (Clicking on the "New Game" button does not refresh the page so there is no waiting time for that.)

The dictionary API does not allow cross domain access. There are at least 2 ways to work around it.

1. The current implementation uses a CORS proxy (https://cors-proxy.htmldriven.com) to set CORS headers. 

Among several proxies that I have tested, this one works in Chrome without additional configurations. In Safari, it can also run with the "Disable Cross-Origin Restrictions" option checked in the Develop menu.

2. The fastest way is to install a Chrome extension that disables CORS restriction. There are several of them serving this purpose. The one I'm using is called "Allow-Control-Allow-Origin: *" offered by vitvad. This approach loads the dictionary fastest but does not work in other browsers without the extension.

## My thought and implementation process

### Why I chose JavaScript

When I was about to start this project, the first thing came to my mind was which language I should choose. I am more familiar with Java from previous academic experiences, and only started learning JavaScript recently. However, I am increasingly interested in web front-end development, and this is an exciting learning opportunity to build my first JavaScript project. It turned out to be very rewarding, and I had so much fun during the week!

### How I started

Big problems are nothing more than a collection of small problems. Each time I face a problem, I always try to break it down into smaller solvable problems that I can solve within a reasonable amount of time.

To implement the simplest version of the game, I first broke it down into two main components -- data logic and UI logic. As the project evolves, I broke both down into even smaller pieces.

#### Data logic

I first carefully went through all requirements and game rules to define the basic concepts and relationships between them. Then I abstracted data structures and diagrams to represent each of them. All of these were done on a piece of paper.

1. I need a random word from the dictionary for player to guess.
  - So I need a variable to store the word.
  - I also need to know what unique letters the word has, and store them in an array.
  - I need to know which letters have been guessed, and if the guesses are correct.
    - So I decided to use two more arrays for that, one for correct guesses, one for incorrect ones.
2. I need to receive a letter that player guessed, and see if it's correct.
  - So I need a variable to store the guessed letter.
  - Compare it with correct/incorrect guesses to make sure it hasn't been guessed.
  - Compare it with undiscovered letters to see if it's a correct guess.
  - If yes, take the letter out of undiscovered letters.
  - Update correct or incorrect guesses array accordingly.
3. Did the player win?
  - Yes if all unique letters are discovered, which means the undiscovered letters array is empty.
  - End the game and declare victory.
4. Did the player lose?
  - Yes if number of wrong guesses is 6, so we just check the length of that array.
  - Game over.
5. If the game is still not over, take another guess.
  - Back to step 2.

After sorting out the core logic, I wrote it down in JavaScript (hangman.js), debugged with mock data, until it yielded correct results. I didn't have UI at this point, so I used browser console as the temporary UI.

#### UI logic

I first built a simple static webpage (index.html) with most essential UI components:

- A keyboard of letters.
- An area above the keyboard for displaying the masked word.
- A sidebar for displaying game status like number of remaining guesses.

More UI components were later added while new features and extensions were implemented.

I used Bootstrap and a custom CSS file (hangman.css) to make the UI look nicer.

I added "click" event listener to each letter key on the keyboard, which calls the core data logic to update data structures. Then I read the latest game status and update UI components accordingly.

1. What letter did the player guess?
  - Read from the text content of the element.
  - Don't check it if it's already guessed.
  - Don't check it if game has ended.
2. Was it a correct guess?
  - Mark the letter key in green color.
  - Re-mask the word so that discovered letters are no longer masked.
3. Was it a wrong guess?
  - Mark the letter key in red color.
4. Did the player lose?
  - Unmask the word.
5. Update UI to refresh the latest game status.

### Adding features and extensions

Several features were implemented but I started with the must-have and simple ones. 

#### Load dictionary from the provided dictionary API and pick a random word

One challenge here was the cross-domain AJAX request. I first thought it was a bug in the dictionary API that the required CORS header was simply missing. I figured there are Chrome extensions that can turns off CORS restrictions and allow me to unblock myself, so I did that. In the meanwhile, I reported the "bug" to the team and learned that it's actually part of this challenge. So I tried some other approaches and decided to use a CORS proxy. It was fun to learn these tricks.

#### Reset the game by clicking on the "New Game" button

The interesting challenge here was the increasing complexity as new features were added. At first, resetting the game was fairly easy and straightforward, because not many variables needed to be reset. As the game evolves, the reset logic became a lot more cumbersome, which made me decide to refactor the whole game completely. I will explain that in the [OOP Refactor sections](https://github.com/bzhang/hangman-game#oop-refactor) below.

#### Get a hint by clicking on the "Hint" button

I designed this feature to add more fun to the game. Each hint unveils one correct letter. Of course hint shouldn't be unlimited so I added scores, hearts and multiple rounds of games so that hinting would make sense to the player. This introduced even more complexity which made a complete refactoring necessary.

#### The score/heart system

I used hearts to represents the player's in-game lives. Each player has 3 lives. Losing a game or using a hint costs them 1 heart. Correctly guessing letters and words will reward them with points. A final score is calculated when the player loses all 3 hearts.

#### The leaderboard

Now that we have player scores, a leaderboard would make total sense, and it's a major feature. The leaderboard keeps track of top 10 high scores and player names. Clicking on the "Leaderboard" button at any time will display the ranking. There were several fun challenges during the implementation and I learned a lot from them.

- One UI challenge was to make a modal dialog in JavaScript and CSS, which I have never done before. I did some research, learned the basic ideas about how to show the element, how position it properly, how to fill in content, how to hide it, and how to show it again next time.
- How to build a leaderboard table. I learned about dynamically creating and inserting DOM elements, and updating inner HTML of them, which are super cool.
- How to sort an array of objects (which contain names and scores) using a compare function.
- Request player name if the final score is high enough to join the leaderboard when game ended. If player decides to not share his/her name, the name will be saved as "Anonymous Player". An interesting observation was that, although in the script I update DOM elements before presenting a prompt dialog, these element are not updated, until the prompt dialog is closed. I did some research and found that it was actually because the browser schedules DOM updates at a later time, for performance reasons, but shows prompt dialogs immediately, before executing the scheduled DOM updates. I had to make sure a "reflow" happens before I request for a prompt dialog. My solution is to wrap the prompt method in a `window.setTimeout()` and delay it for 5 milliseconds. This is not noticeable by the player, but allows the UI to update before the prompt.
- The leaderboard data is stored in Local Storage so that it survives page reload.

#### Animation

These are the first set of animations I have ever implemented and I think they are super cool! I learned that there is a simple way to build animation in JavaScript without having to use an external library. The approach is called "Sprite Animation". The basic idea is, for each animation, make a Sprite image that consists all frames, set it as background image of an element, and use JavaScript to move it around to display frames sequentially. I made 8 simple Sprite images, each consists of 2 frames. The final result was a dancing figure with changing faces for each game step, which is very entertaining.

#### Small UI improvements

- Display correctly guessed letter in green color and wrongly guessed letter in red
- When game ended, display word in green color if won and in grey if lost
- Display and update the number of remaining guesses and win/lose messages
- Display and update current game scores and player's remaining lives
- Add favicon and logo images

### OOP refactoring

While more and more features were added to the game, I realized that my code became very cumbersome and error-prone. I had noticed some problems and bad practices.

There were too many public variables scattered all over the place. I went through my code, localized most of them into functions that are only connected via their interfaces. This made my code cleaner, but there were still too many functions and they were not grouped into larger packages with separation of concerns.

I moved one step further, created several classes and objects, and converted functions and variables into methods and properties. These classes and objects represent larger collections of concepts, for example, players, games, or leaderboard. I ended up rewrote pretty much the entire code. It was a huge effort to decouple these items and create encapsulation, but the end result was greatly helpful. For example, I no longer needed to manually reset each game and player state. I simply discard the old instance and create a fresh copy with all initial states. Also the code became much more readable and expandable, and much less error-prone because a lot of problems are now avoided by design.

I didn't complete all the refactoring that I wanted, but I have run out of time for this coding challenge. Some UI-related code, for example, haven't been moved into my `ui` object which was designed to handle all UI-related logic.

This was my first OOP experience in JavaScript. It was a bit of learning curve as it's quite different from Java. Use of callback functions and asynchronous operations were also new to me, and they were very cool to learn.

## Code structure

The current code consists of three main files: index.html, hangman.css and hangman.js.

### `hangman.js`

The JavaScript code is broken down into four classes/objects: Game, Player, Leaderboard and UI.

Game handles game logic like picking random words, keeping track of status of each letter, checking if game is won or lost, masking undiscovered letters, giving hints, and so on. One instance of Game is created for each round of game, so that I don’t need to worry about resetting game states.

Player keeps track of current player’s statistics across multiple rounds of games, like how many games they have played/won, how many points and hearts they have, and updating them after each game. A new player is created when the current one loses all hearts.

Leaderboard stores top ten scores in Local Storage and updates it as needed.

UI deals with updating DOM elements based on the current states of Game, Player, and Leaderboard.

Outside of these main components, there are some other functions for things like fetching dictionary from web API, and after that, start the “main” program by creating a new Game and a new Player, set up event listeners, and so on.

