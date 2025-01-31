import { RandomAttackAI } from '../src/attackAI.js';
import { Player } from '../src/battleship-objects.js';

test('RandomAttackAI autoAttack does an attack', () => {
  const ai = new RandomAttackAI();
  const attacker = new Player({ attackAI: ai });
  const defender = new Player({ opponent: attacker });

  const attackResult = ai.attackAs(attacker);
  expect(attackResult).toHaveProperty('x');
  expect(attackResult).toHaveProperty('y');

  expect(
    defender.board.hasBeenAttacked(attackResult.x, attackResult.y)
  ).toBe(true);
});