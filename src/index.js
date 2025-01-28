import "./style.css";

import { Player } from "./battleship-objects.js";
import { PredeterminedPlacementAI } from "./placementAI.js";
import { RandomAttackAI } from "./attackAI.js";

class GridController {
  constructor(containerNode) {
    this._containerNode = containerNode;
    this._containerNode.addEventListener('click', this._onClick.bind(this));
  }

  bindPlayer(player) {
    // Change player and associated subscriptions
    if (this._player) {
      this._player.unsubscribe(this._onPlayerChange.bind(this));
    }
    this._player = player;
    this._player.subscribe(this._onPlayerChange.bind(this));

    // Update board display
    this._setupStyle();
    this._setupCells();
  }

  get columnCount() {
    if (this._player) {
      return this._player.board.width;
    } else {
      return 0;
    }
  }

  get rowCount() {
    if (this._player) {
      return this._player.board.height;
    } else {
      return 0;
    }
  }

  setCellClickListener(func) {
    this._onCellClick = func;
  }

  setCellChangeListener(func) {
    this._onCellChange = func;
  }

  cellNodeAtCoords(x, y) {
    return document.getElementById(this.idAtCoords(x, y));
  }

  idAtCoords(x, y) {
    return `${this._containerNode.id},${x},${y}`;
  }

  coordsAtId(id) {
    let [containerId, x, y] = id.split(',');
    return { x, y };
  }

  //-- private event handling --

  _onPlayerChange(event) {
    if (this._onCellChange) {
      let cellNode = this.cellNodeAtCoords(event.x, event.y);
      this._onCellChange(cellNode, event);
    }
  }

  _onClick(event) {
    if (event.target.classList.contains('cell')) {
      if (this._onCellClick) {
        // TODO: incorporate coords into cellEventArgs
        let cellEventArgs = Object.assign(
          {},
          this.coordsAtId(event.target.id),
          { player: this._player },
        );
        this._onCellClick(event.target, cellEventArgs);
      }
    }
  }

  //-- private setup helpers --

  _setupStyle() {
    const aspectRatio = this.columnCount / this.rowCount;
    this._containerNode.style.setProperty('aspect-ratio', aspectRatio);
    this._containerNode.style.setProperty(
      'grid-template-columns',
      `repeat(${this.columnCount}, 1fr)`
    );
    this._containerNode.style.setProperty(
      'grid-template-rows',
      `repeat(${this.rowCount}, 1fr)`
    );
  }

  _setupCells() {
    this._containerNode.replaceChildren();
    // For every possible coordinate pair on the board...
    for (let y = 0; y < this.rowCount; y++) {
      for (let x = 0; x < this.columnCount; x++) {
        // Create a cell here.
        let cellNode = document.createElement('div');
        cellNode.classList.add('cell');
        cellNode.id = this.idAtCoords(x, y);
        if (this._onCellChange) {
          // Refresh the cell to reflect the player's current board.
          this._onCellChange(
            cellNode, 
            { sender: this._player, action: 'bind', x, y },
          );
        }
        this._containerNode.appendChild(cellNode);
      } // end for x
    } // end for y
  } // end _setupCells()

} // end class GridController

const ShipBoardController = (function() {
  // TODO: Implement drag and drop ship placement.

  const _gridController = new GridController(
    document.getElementById('player-board')
  );

  _gridController.setCellChangeListener(function(cellNode, eventArgs
  ) {
    // Refresh this cellNode; make it up-to-date with board state.
    let { x, y, sender: { board } } = eventArgs;
    if (board.hasShipAt(x, y)) {
      // There's a ship here. A missed attack should not show.
      cellNode.classList.add('ship');
      cellNode.classList.remove('miss');

      // Show a hit only if applicable.
      if (board.hasBeenAttacked(x, y)) {
        cellNode.classList.add('hit');
      } else {
        cellNode.classList.remove('hit');
      }
    } else {
      // No ship here.
      cellNode.classList.remove('ship');
      cellNode.classList.remove('hit');

      // Show a miss  only if applicable.
      if (board.hasBeenAttacked(x, y)) {
        cellNode.classList.add('miss');
      } else {
        cellNode.classList.remove('miss');
      }
    }
  });

  _gridController.setCellClickListener();

  const bindPlayer = function(player) {
    _gridController.bindPlayer(player);
  };

  return { bindPlayer };
}());

const AttackBoardController = (function() {
  let _attacker = null;

  const _gridController = new GridController(
    document.getElementById('opponent-board')
  );

  _gridController.setCellChangeListener(function(cellNode, eventArgs) {
    // Refresh this cellNode; make it up-to-date with board state.
    let { x, y, sender: { board } } = eventArgs;
    cellNode.classList.remove('hit');
    cellNode.classList.remove('miss');
    if (board.hasBeenAttacked(x, y)) {
      if (board.hasShipAt(x, y)) {
        console.log('hit at', x, y);
        cellNode.classList.add('hit');
      } else {
        console.log('miss at', x, y);
        cellNode.classList.add('miss');
      }
    }
  });

  _gridController.setCellClickListener(function(cellNode, eventArgs) {
    if (_attacker.canAttack(eventArgs.x, eventArgs.y)) {
      _attacker.attack(eventArgs.x, eventArgs.y);
      // TODO: Lock the attack grid until it's the player's turn again.
    }
  });

  const bindPlayer = function(player) {
    _attacker = player.opponent;
    _gridController.bindPlayer(player);
  };

  return { bindPlayer };
}());

const GameController = (function() {
  const _messageNode = document.getElementById('message');

  let player1 = null;
  let player2 = null;

  const setMessage = function(text) {
    _messageNode.innerText = text;
  };

  const startNewGame = function() {
    player1 = new Player({
      name: 'Player 1',
      placementAI: new PredeterminedPlacementAI(),
    });
    player1.subscribe(_onPlayerAction.bind(this));
    player1.autoPlaceShips();
    
    player2 = new Player({
      name: 'CPU',
      placementAI: new PredeterminedPlacementAI(),
      attackAI: new RandomAttackAI(),
      opponent: player1
    });
    player2.subscribe(_onPlayerAction.bind(this));
    player2.autoPlaceShips();

    ShipBoardController.bindPlayer(player1);
    AttackBoardController.bindPlayer(player2);
    
    setMessage("This game is under construction.");
  }

  const _onPlayerAction = function(eventArgs) {
    if (eventArgs.action == 'attack') {
      console.log("A player attacked."); // TODO: remove
      startTurn(eventArgs.sender.opponent);
    }
  }

  const startTurn = function(player) {
    if (player.isHuman()) {
      // TODO: Unlock the attack grid so they can attack.
    } else {
      // TODO: Set a brief timer before auto-attack.
      player.autoAttack();
    }
  }

  return {
    setMessage,
    startNewGame,
  };
}());

GameController.startNewGame();




