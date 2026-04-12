# Rock | Paper | Scissors

## Description

  Implementing the Rock, Paper, Scissors game in JavaScript

## Pseudocode for latest script.js

  ### Description
    Implementing a game with console output

### Initialization of the player and computer score counters

### Function for getting a random computer choice
  #### - Initialization of an array with elements representing the choice options

### Function for getting the player's choice
  #### - Prompting the user to enter their choice
  #### - Converting the input data to lowercase, starting with a capital letter

### Function for conducting a game round
  #### - Initialization of arrays with elements representing the choice options and the round result options, respectively

  #### - Initialization of various player and computer choice results

  #### - Handling a tie result

  #### - Branching of round results
    - In the case of humanRock and computerPaper =>
      - increase the computer's score by 1
      - return the result as a string
    - In the case of humanRock and computerScissors =>
      - increase the score Player's score by 1
      - return the result as a string
    - In case of humanPaper and computerRock =>
      - increase the player's score by 1
      - return the result as a string
    - In case of humanPaper and computerScissors =>
      - increase the computer's score by 1
      - return the result as a string
    - In case of humanScissors and computerRock =>
      - increase the computer's score by 1
      - return the result as a string
    - In case of humanScissors and computerPaper =>
      - increase the player's score by 1
      - return the result as a string

### Game Play Function
  #### - Prompt the user to enter the number n of game rounds

  #### - Play n rounds of the game
    - Get the player and computer's selection

    - Output the round result as:
        `Round n
        Player's selection
        Computer's selection
        Round result

        Total score
        Player's score
        Computer's score`

  #### - Play extra rounds in case of a tie after n rounds
    - Notification of a tie
    - Play extra rounds until the score is no longer tied
    - Get the player's and computer's selections

    - Output the extra round result as:
        `Extra Round
        Player's Selection
        Computer's Selection
        Round Result

        Overall Score
        Player's Points
        Computer's Points`

  #### - Determine and declare the winner of the entire game

### Call the game running function

## Pseudocode for new script.js

  ### Description
  #### Game implementation with added UI:
    - Button selection
    - Best-of-five game
    - Results displayed on the page

### Initialize the player and computer score counters

### Get references to the block with player selection buttons and the result output block

### Initialize the round result output strings

### Initialize the game result output strings

### Function for getting a random computer selection
  #### - Initialize an array with elements representing the selection options

### Function for running a game round
  #### - Initialize arrays with elements representing the selection options and the round result options respectively

  #### - Initialization of various player and computer selection results

  #### - Branching of round results
    - In case of a tie =>
      - display the round result
    - In case of humanRock and computerPaper =>
      - increase the computer's score by 1
      - display the round result
    - In case of humanRock and computerScissors =>
      - increase the player's score by 1
      - display the round result
    - In case of humanPaper and computerRock =>
      - increase the player's score by 1
      - display the round result
    - In case of humanPaper and computerScissors =>
      - increase the computer's score by 1
      - display the round result
    - In case of humanScissors and computerRock =>
      - increase the computer's score by 1
      - display the round result
    - In case of humanScissors and computerPaper =>
      - increase the player's score by 1
      - display the round result

### Adding an event listener for a button click Choice
  #### - Read the player's choice

  #### - Play a game round with the player's choice received

  #### - Display the round result

  #### - Check if the player or the computer has reached 5 points
    - When one of the players reaches 5 points =>
      - Disable the listener
      - Display the overall game result