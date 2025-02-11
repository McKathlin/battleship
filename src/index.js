import "./style.css";

import { Player } from "./battleship-objects.js";
import { RandomPlacementAI } from "./placementAI.js";
import { RandomAttackAI } from "./attackAI.js";

//=============================================================================
// Grid Controller
//-----------------------------------------------------------------------------
// This handles interactions with and updates to a GameBoard's grid.
// The Ship Grid Controller and the Attack Grid Controller both use this.
//=============================================================================

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

  cellNodeAtCoords(x, y) {
    return document.getElementById(this.idAtCoords(x, y));
  }

  coordsAtId(id) {
    const [containerId, xStr, yStr] = id.split(',');
    const x = Number.parseInt(xStr);
    const y = Number.parseInt(yStr);
    return { x, y };
  }

  idAtCoords(x, y) {
    return `${this._containerNode.id},${x},${y}`;
  }

  setCellClickListener(func) {
    this._onCellClick = func;
  }

  setCellChangeListener(func) {
    this._onCellChange = func;
  }

  lock() {
    this._containerNode.classList.add('locked');
    this._locked = true;
  }

  unlock() {
    this._locked = false;
    this._containerNode.classList.remove('locked');
  }

  //-- private event handling --

  _onPlayerChange(event) {
    if (this._onCellChange) {
      let cellNode = this.cellNodeAtCoords(event.x, event.y);
      this._onCellChange(cellNode, event);
    }
  }

  _onClick(event) {
    if (this._onCellClick && !this._locked && event.target.classList.contains('cell')) {
      let cellEventArgs = Object.assign(
        {},
        this.coordsAtId(event.target.id),
        { player: this._player },
      );
      this._onCellClick(event.target, cellEventArgs);
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

//=============================================================================
// Ship Board Controller
//-----------------------------------------------------------------------------
// This is where the player places their own ships.
// Once the attack phase begins, attacks on the player show here.
//=============================================================================

const ShipBoardController = (function() {
  // TODO: Implement drag and drop ship placement.

  let _player = null;
  let _board = null;
  let _currentShip = null;
  let _isVertical = false;
  let _isLocked = false;

  //-- Setup --

  const _gridController = new GridController(
    document.getElementById('player-board')
  );

  _gridController.setCellChangeListener(function(cellNode, eventArgs
  ) {
    _refreshCell(cellNode, eventArgs.x, eventArgs.y);
  });

  _gridController.setCellClickListener(function(cellNode, { x, y }) {
    if (!_currentShip) {
      return;
    }

    const orientation = _isVertical ? 'vertical' : 'horizontal';
    if (_player.canPlace(_currentShip, x, y, orientation)) {
      const shipToPlace = _currentShip;
      _currentShip = null;
      _player.place(shipToPlace, x, y, orientation);
    } else {
      GameController.setErrorMessage(
        `Can't place this ship at ${x},${y}! Try somewhere else.`);
    }
  });

  //-- Public methods --

  const bindPlayer = function(player) {
    _player = player;
    _board = player.board;
    _gridController.bindPlayer(player);
  };

  const holdShip = function(ship) {
    _isVertical = false;
    _currentShip = ship;
  }

  const releaseShip = function(ship) {
    _isVertical = false;
    _currentShip = ship;
  }

  const getHeldShip = function() {
    return _currentShip;
  }

  const rotate = function() {
    if (_isLocked) {
      return;
    }
    _isVertical = !_isVertical;
    const adverb = _isVertical ? 'vertically' : 'horizontally';
    GameController.setMessage(`To place your ${_currentShip.length}-cell ship ${adverb}, ` +
      "click where its top end will go. Use the R key to rotate.");
  }

  const lock = function() {
    _isLocked = true;
    _gridController.lock();
  };

  const unlock = function() {
    _isLocked = false;
    _gridController.unlock();
  };

  //-- Private methods --

  const _refreshCell = function(cellNode, x, y) {
    if (_board.hasShipAt(x, y)) {
      // There's a ship here. A missed attack should not show.
      cellNode.classList.add('ship');
      cellNode.classList.remove('miss');

      // Show a hit only if applicable.
      if (_board.hasBeenAttacked(x, y)) {
        cellNode.classList.add('hit');
      } else {
        cellNode.classList.remove('hit');
      }
    } else {
      // No ship here to hit.
      cellNode.classList.remove('ship');
      cellNode.classList.remove('hit');

      // Show a miss only if applicable.
      if (_board.hasBeenAttacked(x, y)) {
        cellNode.classList.add('miss');
      } else {
        cellNode.classList.remove('miss');
      }
    }
  }

  return { 
    bindPlayer, 
    holdShip, 
    getHeldShip,
    releaseShip,
    rotate, 
    lock, 
    unlock 
  };
}());

//=============================================================================
// Attack Board Controller
//-----------------------------------------------------------------------------
// This is where the player calls their attacks on the opponent.
// Hits and misses vs. the opponent are recorded here.
//=============================================================================

const AttackBoardController = (function() {
  let _attacker = null;
  let _board = null;

  //-- Setup --

  const _gridController = new GridController(
    document.getElementById('opponent-board')
  );

  _gridController.setCellChangeListener(function(cellNode, eventArgs) {
    _refreshCell(cellNode, eventArgs.x, eventArgs.y);
  });

  _gridController.setCellClickListener(function(cellNode, eventArgs) {
    if (_attacker.canAttack(eventArgs.x, eventArgs.y)) {
      lock();
      _attacker.attack(eventArgs.x, eventArgs.y);
    }
  });

  //-- Public methods --

  const bindPlayer = function(player) {
    _attacker = player.opponent;
    _board = player.board;
    _gridController.bindPlayer(player);
  };

  const lock = function() {
    _gridController.lock();
  };

  const unlock = function() {
    _gridController.unlock();
  };

  //-- Private helper methods --

  const _refreshCell = function(cellNode, x, y) {
    cellNode.classList.remove('hit');
    cellNode.classList.remove('miss');
    if (_board.hasBeenAttacked(x, y)) {
      if (_board.hasShipAt(x, y)) {
        console.log('hit at', x, y);
        cellNode.classList.add('hit');
      } else {
        console.log('miss at', x, y);
        cellNode.classList.add('miss');
      }
    }
  };

  return { bindPlayer, lock, unlock };
}());

//=============================================================================
// Game Controller
//-----------------------------------------------------------------------------
// This module coordinates gameplay at a high level:
// ship placement phase, turn order during the attack phase, and win checking.
//=============================================================================

const GameController = (function() {
  const COMPUTER_DELAY = 1600;

  //-- DOM elements --

  const _messageNode = document.getElementById('message');

  const _placementActionBarNode =
    document.getElementById('placement-action-bar');
  const _placementRandomizeButton =
    document.getElementById('placement-randomize-button');
  const _placementClearButton =
    document.getElementById('placement-clear-button');
  const _placementDoneButton =
    document.getElementById('placement-done-button');

  const _attackSectionNode = document.getElementById('opponent');

  //-- Logic variables --

  let player1 = null;
  let player2 = null;
  let currentPlayer = null;

  //-- Public methods --

  const setMessage = function(text) {
    _messageNode.classList.remove('error');
    _messageNode.innerText = text;
  };

  const setErrorMessage = function(text) {
    _messageNode.classList.add('error');
    _messageNode.innerText = text;
  }

  const startNewGame = function() {
    player1 = new Player({
      name: 'Player 1',
      placementAI: new RandomPlacementAI(),
    });
    player1.subscribe(_onPlayerAction.bind(this));
    ShipBoardController.bindPlayer(player1);
    
    player2 = new Player({
      name: 'CPU',
      placementAI: new RandomPlacementAI(),
      attackAI: new RandomAttackAI(),
      opponent: player1
    });
    player2.autoPlaceShips();
    player2.subscribe(_onPlayerAction.bind(this));
    AttackBoardController.bindPlayer(player2);

    AttackBoardController.lock();
    ShipBoardController.lock();

    startPlacementPhase();
  }

  const startPlacementPhase = function() {
    // Set up Randomize button.
    _placementRandomizeButton.addEventListener('click', function() {
      player1.autoPlaceShips();
      startNextPlacementStep();
    });

    // Set up Clear button.
    _placementClearButton.addEventListener('click', function() {
      player1.removeAllShips();
      startNextPlacementStep();
    })

    // Set up Done button.
    _placementDoneButton.addEventListener('click', function() {
      startAttackPhase();
    });

    document.addEventListener('keypress', function(event) {
      if (event.key == 'r') {
        ShipBoardController.rotate();
      }
    })

    // Unlock board.
    ShipBoardController.unlock();
    startNextPlacementStep();
  };

  const startNextPlacementStep = function() {
    let remainingShips = player1.shipsToPlace;
    if (remainingShips.length == 0) {
      ShipBoardController.releaseShip();
      setMessage("All your ships are placed. Click Done to start the attack phase.");
    } else {
      let nextShip = remainingShips[0];
      ShipBoardController.holdShip(nextShip);
      setMessage(`Your next ship is ${nextShip.length} cells long.` +
        "Click to place its left end. Use the R key to rotate.");
    }
  };

  const canStartAttackPhase = function() {
    return player1.areAllShipsPlaced();
  };

  const startAttackPhase = function() {
    if (canStartAttackPhase()) {
      ShipBoardController.lock();
      _placementActionBarNode.classList.add('hidden');

      AttackBoardController.unlock();
      _attackSectionNode.classList.remove('hidden');

      currentPlayer = player1;
      setMessage("Make your move.");
      return true;
    } else {
      setErrorMessage('Please place all your ships first.');
      return false;
    }
  };

  const startNextTurn = function() {
    // Check for a win.
    if (currentPlayer.wins()) {
      setMessage(`${currentPlayer.name} wins!`);
      return;
    }

    // Change whose turn it is.
    currentPlayer = currentPlayer.opponent;

    // Start the turn.
    if (currentPlayer.isHuman()) {
      AttackBoardController.unlock();
    } else {
      setTimeout(() => currentPlayer.autoAttack(), COMPUTER_DELAY);
    }
  };

  //-- Private event handling --

  const _onPlayerAction = function(eventArgs) {
    if (eventArgs.action == 'place' || eventArgs.action == 'remove') {
      if (!ShipBoardController.getHeldShip()) {
        startNextPlacementStep();
      }
    } else if (eventArgs.action == 'attack') {
      let { sender, x, y, ship } = eventArgs;
      let verb = eventArgs.result == 'hit' ? 'hit' : 'missed';
      let message = `${sender.name} ${verb} ${sender.opponent.name} at ${x},${y}`;
      if (ship && ship.isSunk()) {
        message += `. ${sender.name} sank ${sender.opponent.name}'s ship!`;
      }
      setMessage(message);
      startNextTurn();
    }
  };

  //-- Public returns --

  return {
    setMessage,
    setErrorMessage,
    startNewGame,
    startNextPlacementStep,
    canStartAttackPhase,
    startAttackPhase,
    startNextTurn,
  };
}());

GameController.startNewGame();




