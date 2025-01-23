// PlacementAI interface:
// placeAllShips(player);

// PredeterminedPlacementAI puts ships in hard-coded places.
// It assumes a 10x10 board and up to 5 ships, length 5 or less.
class PredeterminedPlacementAI {
  constructor() {
    // No setup needed here.
  }

  placeAllShips(player) {
    const [carrier, battleship, cruiser, submarine, destroyer] =
      player.shipsToPlace;
    
    if (carrier) {
      player.placeVertical(carrier, 2, 3);
    }
    if (battleship) {
      player.placeHorizontal(battleship, 5, 5);
    }
    if (cruiser) {
      player.placeHorizontal(cruiser, 1, 1);
    }
    if (submarine) {
      player.placeHorizontal(submarine, 4, 8);
    }
    if (destroyer) {
      player.placeVertical(destroyer, 4, 2);
    }
  }
}

// RandomPlacementAI places ships randomly with no particular strategy.
class RandomPlacementAI {
  constructor(funcRandom = Math.random) {
    this._randomFraction = funcRandom;
  }

  placeAllShips(player) {
    for (const ship of player.shipsToPlace) {
      let shipPlaced = false;
      while (!shipPlaced) {
        shipPlaced = this._tryPlaceShip(player, ship);
      }
    }
  }

  _randomBoolean() {
    return this._randomFraction() >= 0.5;
  }

  _randomIndex(length) {
    return Math.floor(this._randomFraction() * length);
  }

  _tryPlaceShip(player, ship) {
    let funcPlace, funcCanPlace, shipWidth, shipHeight;
    if (this._randomBoolean()) {
      funcPlace = player.placeHorizontal;
      funcCanPlace = player.canPlaceHorizontal;
      shipWidth = ship.length;
      shipHeight = 1;
    } else {
      funcPlace = player.placeVertical;
      funcCanPlace = player.canPlaceVertical;
      shipWidth = 1;
      shipHeight = ship.length;
    }
    let x = this._randomIndex(1 + player.board.width - shipWidth);
    let y = this._randomIndex(1 + player.board.height - shipHeight);
    if (funcCanPlace.call(player, ship, x, y)) {
      funcPlace.call(player, ship, x, y);
      return true;
    } else {
      return false;
    }
  }
}

export { PredeterminedPlacementAI, RandomPlacementAI };