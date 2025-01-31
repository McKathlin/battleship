// AttackAI interface:
// attackAs(player);

// RandomAttackAI attacks a random spot that has not yet been attacked.
class RandomAttackAI {
  constructor(funcRandom = Math.random) {
    this._randomFraction = funcRandom;
  }

  attackAs(player) {
    const width = player.opponent.board.width;
    const height = player.opponent.board.height;
    let x = -1;
    let y = -1;
    while (!player.canAttack(x, y)) {
      // Roll random x,y coordinates.
      x = Math.floor(this._randomFraction() * width);
      y = Math.floor(this._randomFraction() * height);
    }
    return player.attack(x, y);
  }
}

export { RandomAttackAI };