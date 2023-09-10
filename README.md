# Battleship

This is a version of the board game Battleship.

The objective of this game is to guess the positions of where your opponent placed their five ships before they guess yours.

[Can be be played by clicking here.](https://suzuhe481.github.io/battleship/)

## Description

To play, start the game, pick your difficulty, then place your five ships on the left board.

You can change the direction of the ship between horizontal and vertical by clicking the Rotate Ship button.

The cells will be highlighted green to show that you can place a ship on that cell.
You will not be able to place a ship if the cell is red, indicated an invalid ship position.

After you place your five ships, the game will start.
You will go first, and you can guess a position on the Computer's board, the right board.
On the Computer's turn, they will make a guess.
This will repeat until the Player or the Computer guesses the location of all of their opponent's ships.

On each turn, you will see the current player's name.
On each guess, you will see if it was a hit or miss.
If a ship is destroyed, the name of the ship will be displayed.

## Releases

### Release 4

- Fixed bug that crashed game during gameplay if ships were placed next to each other horizontally.

### Release 3

- Improved appearance on mobile.
- A list of previous guesses which show both player's last guess and also show the ships sunk.

### Release 2

- New difficulty options.
  - **Easy** - The computer will guess randomly.
  - **Realistic** - The computer will make guesses similar to a human player. They will make guesses around previously landed hits.
- Player names added above boards.
- Description of the game added.

### Release 1

- Simple battleship game.
- Computer AI plays random guesses.
- Ships are highlighted on hover to indicate valid placement.
