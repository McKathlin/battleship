import Observable from './lib/observable.js';

//=============================================================================
// Ship
//=============================================================================

class Ship {
  constructor(length) {
    this._length = length;
    this._hitCount = 0;
  }

  get length() {
    return this._length;
  }

  get hitCount() {
    return this._hitCount;
  }

  hit() {
    this._hitCount += 1;
  }

  isSunk() {
    return this._hitCount >= this._length;
  }
}

//=============================================================================
// GameBoard
//=============================================================================

class GameBoard extends Observable {
  constructor(w, h) {
    super();
    this._width = w;
    this._height = h;
    this._ships = [];
    this._shipGrid = new Array(w * h);
    this._attackGrid = new Array(w * h);
  }

  get ships() {
    return [...this._ships];
  }

  get sunkShips() {
    return this._ships.filter((ship) => ship.isSunk());
  }

  get survivingShips() {
    return this._ships.filter((ship) => !ship.isSunk());
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  areAllShipsSunk() {
    return this._ships.length > 0 && this._ships.every((ship) => ship.isSunk());
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  //-- Ship placement --

  shipAt(x, y) {
    if (!this.isInBounds(x, y)) {
      return null;
    }
    return this._shipGrid[this._indexAt(x, y)] ?? null;
  }

  hasShipAt(x, y) {
    return !!this.shipAt(x, y);
  }

  canPlaceHorizontal(ship, x, y) {
    // Check bounds on either end
    if (!this.isInBounds(x, y)) {
      return false;
    }
    if (!this.isInBounds(x + ship.length - 1, y)) {
      return false;
    }

    // Check availability on every cell
    for (let i = 0; i < ship.length; i++) {
      if (this.hasShipAt(x + i, y)) {
        return false;
      }
    }

    // All clear!
    return true;
  }

  canPlaceVertical(ship, x, y) {
    // Check bounds on either end
    if (!this.isInBounds(x, y)) {
      return false;
    }
    if (!this.isInBounds(x, y + ship.length - 1)) {
      return false;
    }

    // Check availability on every cell
    for (let i = 0; i < ship.length; i++) {
      if (this.hasShipAt(x, y + i)) {
        return false;
      }
    }

    // All clear!
    return true;
  }

  placeHorizontal(ship, x, y) {
    if (!this.canPlaceHorizontal(ship, x, y)) {
      throw new Error(`No room for horizontal placement at ${x},${y}`);
    }

    for (let i = 0; i < ship.length; i++) {
      this._shipGrid[this._indexAt(x + i, y)] = ship;
      this.notifyChanged({
        x: x + i,
        y,
        action: 'place',
        ship,
      });
    }
    this._ships.push(ship);
  }

  placeVertical(ship, x, y) {
    if (!this.canPlaceVertical(ship, x, y)) {
      throw new Error(`No room for vertical placement at ${x},${y}`);
    }

    for (let i = 0; i < ship.length; i++) {
      this._shipGrid[this._indexAt(x, y + i)] = ship;
      this.notifyChanged({
        x,
        y: y + i,
        action: 'place',
        ship,
      });
    }
    this._ships.push(ship);
  }

  //-- Ship attacks --

  canBeAttacked(x, y) {
    return this.isInBounds(x, y) && !this.hasBeenAttacked(x, y);
  }

  hasBeenAttacked(x, y) {
    return !!this._attackGrid[this._indexAt(x, y)];
  }

  receiveAttack(x, y) {
    if (!this.canBeAttacked(x, y)) {
      throw new Error(`Can't attack ${x},${y}`);
    }

    // Mark index as attacked
    this._attackGrid[this._indexAt(x, y)] = true;

    // If there's a ship, mark it as hit.
    const hitShip = this.shipAt(x, y);
    let result;
    if (hitShip) {
      hitShip.hit();
      result = 'hit';
    } else {
      result = 'miss';
    }

    this.notifyChanged({ x, y, ship: hitShip, action: 'receiveAttack', result });
    return { x, y, hitShip };
  }

  //-- Private helper methods --

  _indexAt(x, y) {
    return (Number.parseInt(y) * this.width) + Number.parseInt(x);
  }
}

const STANDARD_BOARD_WIDTH = 10;
const STANDARD_BOARD_HEIGHT = 10;
const STANDARD_SHIP_SPECS = [5, 4, 3, 3, 2];

//=============================================================================
// Player
//=============================================================================

class Player extends Observable {
  constructor({
    name = 'Player',
    opponent = null,
    placementAI = null,
    attackAI = null,
    boardWidth = STANDARD_BOARD_WIDTH,
    boardHeight = STANDARD_BOARD_HEIGHT,
    shipSpecs = STANDARD_SHIP_SPECS,
  } = {}) {
    super();

    this._placementAI = placementAI;
    this._attackAI = attackAI;

    this._board = new GameBoard(boardWidth, boardHeight);
    this._board.subscribe(this._onBoardChange.bind(this));

    this._shipSetToPlace = new Set(
      shipSpecs.map((length) => new Ship(length))
    );

    this.name = name;
    this.opponent = opponent;
  }

  get board() {
    return this._board;
  }

  get name() {
    return this._name;
  }
  set name(str) {
    this._name = str;
    this.notifyChanged({ property: 'name' });
  }

  get opponent() {
    return this._opponent;
  }
  set opponent(otherPlayer) {
    this._opponent = otherPlayer;
    if (otherPlayer) {
      otherPlayer._opponent = this;
    }
    this.notifyChanged({ property: 'opponent' });
  }

  // Returns all not-yet-placed ships, longest to shortest.
  get shipsToPlace() {
    return [...this._shipSetToPlace].sort((a, b) => b.length - a.length);
  }

  get placedShips() {
    return this._board.ships;
  }

  isComputer() {
    return !!this._attackAI;
  }

  isHuman() {
    return !this.isComputer();
  }

  autoPlaceShips() {
    if (this._placementAI) {
      this._placementAI.placeAllShips(this);
      return true;
    } else {
      return false;
    }
  }

  areAllShipsPlaced() {
    return this._shipSetToPlace.size == 0;
  }

  wins() {
    return this.opponent.loses();
  }

  loses() {
    return this.board.areAllShipsSunk();
  }

  canPlaceHorizontal(ship, x, y) {
    return this._board.canPlaceHorizontal(ship, x, y);
  }

  canPlaceVertical(ship, x, y) {
    return this._board.canPlaceVertical(ship, x, y);
  }

  placeHorizontal(ship, x, y) {
    this._mustOwnShip(ship);
    this._board.placeHorizontal(ship, x, y);
    this._markPlaced(ship);
  }

  placeVertical(ship, x, y) {
    this._mustOwnShip(ship);
    this._board.placeVertical(ship, x, y);
    this._markPlaced(ship);
  }

  canAttack(x, y) {
    if (!this.opponent) {
      return false;
    }
    return this.opponent.board.canBeAttacked(x, y);
  }

  attack(x, y) {
    if (!this.canAttack(x, y)) {
      throw new Error(`Player can't attack ${x},${y}`);
    }
    let result = this.opponent.board.receiveAttack(x, y);
    this.notifyChanged({ action: 'attack', x, y, result });
    return result;
  }
  
  autoAttack() {
    if (this._attackAI) {
      return this._attackAI.attackAs(this);
    } else {
      return null;
    }
  }

  // private event handling

  _onBoardChange(boardEventArgs) {
    const eventArgs = Object.assign({},
      boardEventArgs,
      { sender: this, property: 'board' },
    );
    this.notifyChanged(eventArgs);
  }

  // private helpers

  _mustOwnShip(ship) {
    if (!this._shipSetToPlace.has(ship) && !this.board.ships.includes(ship)) {
      throw new Error("That's not this player's ship!");
    }
  }

  _markPlaced(ship) {
    this._shipSetToPlace.delete(ship);
  }
}

export { Ship, GameBoard, Player };