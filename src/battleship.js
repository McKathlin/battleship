
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
}

export { Ship, GameBoard };