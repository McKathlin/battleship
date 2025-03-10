# Battleship

This implementation of the classic game Battleship was made as part of The Odin Project curriculum.
In this edition of the game one human player engages in turn-based combat against one computer-controlled player.
Each player tries to sink all their opponents' ships before their own ships are sunk.

This game is live on GitHub Pages here: [Battleship by McKathlin](https://mckathlin.github.io/battleship)

## Placing Ships

Each player has five ships:

| Name             | Length |
| :--------------- | -----: |
| Aircraft Carrier |     5  |
| Battleship       |     4  |
| Cruiser          |     3  |
| Submarine        |     3  |
| Destroyer        |     2  |

When placed, each ship occupies the number of cells equal to its length in a straight line,
either vertical or horizontal, within the bounds of the board.

The human player is prompted to place their own ships one by one, longest to shortest.
Ship placement starts in horizontal mode, but the orientation can be toggled to and from vertical
by using the `R` key. In horizontal mode, the cell clicked on the ship board becomes the
ship's farthest left cell. In vertical mode, the clicked cell becomes the ship's top cell.

The three buttons above the ship board have the following functions:
* **Randomize**: Place all ships randomly.
* **Clear**: Remove all ships and start over again.
* **Done**: Move to the attack phase. This only works if all ships are placed.

## Attacking

Once the human player has placed all their ships and clicked the "Done" button,
an empty board labeled "Attacks on Opponent" appears. This is where the human player
calls their attacks. The players take turns, with the human player going first.
Each round proceeds as follows:

1. They click on a cell to attack it. (It must be a cell they haven't previously attacked.)
2. An icon appears on that cell: a large sunburst for a hit, or a small circle for a miss.
3. A few seconds later, the computer opponent attacks. Their attacks appear on the human player's ship board.

Once a player has hit all cells of a particular ship, a message will announce that the ship has sunk.
A player wins when they have sunk all their opponent's ships.
