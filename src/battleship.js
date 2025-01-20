
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

class GameBoard {
  constructor(w, h) {
    this._width = w;
    this._height = h;
    this._shipGrid = new Array(w * h);
    this._ships = [];
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  shipAt(x, y) {
    if (!this.isInBounds(x, y)) {
      return null;
    }
    let index = this._indexAt(x, y);
    return this._shipGrid[index] ?? null;
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
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
      let index = this._indexAt(x + i, y);
      this._shipGrid[index] = ship;
    }
    this._ships.push(ship);
  }

  placeVertical(ship, x, y) {
    if (!this.canPlaceVertical(ship, x, y)) {
      throw new Error(`No room for vertical placement at ${x},${y}`);
    }

    for (let i = 0; i < ship.length; i++) {
      let index = this._indexAt(x, y + i);
      this._shipGrid[index] = ship;
    }
    this._ships.push(ship);
  }

  //-- Private helper methods --//

  _indexAt(x, y) {
    return (y * this.height) + x;
  }
}

export { Ship, GameBoard };