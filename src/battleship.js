
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
    this._grid = new Array(w * h);
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
    let index = (y * this.height) + x;
    return this._grid[index] ?? null;
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  hasShipAt(x, y) {
    return !!this.shipAt(x, y);
  }

  canPlaceHorizontal(ship, x, y) {
    return true; // TODO
  }

  canPlaceVertical(ship, x, y) {
    return true; // TODO
  }

  placeVertical(ship, x, y) {
    // TODO
  }

  placeHorizontal(ship, x, y) {
    // TODO
  }
}

export { Ship, GameBoard };