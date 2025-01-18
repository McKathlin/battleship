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

export { Ship };