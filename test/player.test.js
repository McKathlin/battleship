import { Player, GameBoard } from '../src/battleship-objects.js';
import { RandomPlacementAI } from '../src/placementAI.js';
import { RandomAttackAI } from '../src/attackAI.js';

// Player property tests

test('remembers name from init', () => {
  let me = new Player({ name: 'Tarzan' });
  let you = new Player({ name: 'Jane' });

  expect(me.name).toBe('Tarzan');
  expect(you.name).toBe('Jane');
});

test('sets name with property', () => {
  let p = new Player();
  p.name = 'Alice';
  expect(p.name).toBe('Alice');
});

test('is human by default', () => {
  let p = new Player();
  expect(p.isHuman()).toBe(true);
  expect(p.isComputer()).toBe(false);
});

test('is computer if attack AI is assigned', () => {
  let attackAI = { pickAttackCoords: (board) => [0, 0] };
  let cpu = new Player({ attackAI });
  expect(cpu.isComputer()).toBe(true);
  expect(cpu.isHuman()).toBe(false);
});

test('gets a board', () => {
  let p = new Player();
  expect(p.board).toBeInstanceOf(GameBoard);
});

// Ship placement

test('starts with a default set of ships to place', () => {
  let aPlayer = new Player();
  expect(aPlayer.shipsToPlace.length).toBeGreaterThan(0);
});

test('accepts custom set of ships to place', () => {
  let aPlayer = new Player({ shipSpecs: [5, 3, 1, 1] });

  let ships = aPlayer.shipsToPlace;
  expect(ships).toHaveLength(4);

  // There should be two ships of length 1,
  // one ship each of lengths 3 and 5,
  // and no ships of other lengths.
  expect(ships.filter((ship) => ship.length == 1)).toHaveLength(2);
  expect(ships.filter((ship) => ship.length == 2)).toHaveLength(0);
  expect(ships.filter((ship) => ship.length == 3)).toHaveLength(1);
  expect(ships.filter((ship) => ship.length == 4)).toHaveLength(0);
  expect(ships.filter((ship) => ship.length == 5)).toHaveLength(1);
});

test('places ships', () => {
  let aPlayer = new Player({ shipSpecs: [4, 3] });
  expect(aPlayer.placedShips).toHaveLength(0);

  let [firstShip, anotherShip] = aPlayer.shipsToPlace;

  aPlayer.placeVertical(firstShip, 1, 1);
  expect(aPlayer.placedShips).toHaveLength(1);
  expect(aPlayer.placedShips).toContain(firstShip);
  expect(aPlayer.board.shipAt(1, 1)).toStrictEqual(firstShip);

  aPlayer.place(anotherShip, 3, 2, 'horz');
  expect(aPlayer.placedShips).toHaveLength(2);
});

test('detects when all ships are placed', () => {
  let aPlayer = new Player({ shipSpecs: [4, 3] });
  
  expect(aPlayer.areAllShipsPlaced()).toBe(false);

  let ships = aPlayer.shipsToPlace;

  aPlayer.placeVertical(ships[0], 1, 1);
  expect(aPlayer.areAllShipsPlaced()).toBe(false);

  aPlayer.placeHorizontal(ships[1], 3, 2);
  expect(aPlayer.areAllShipsPlaced()).toBe(true);
});

test('auto-places ships if placementAI is present', () => {
  let aPlayer = new Player({ placementAI: new RandomPlacementAI() });
  expect(aPlayer.autoPlaceShips()).toBe(true);
  expect(aPlayer.areAllShipsPlaced()).toBe(true);
});

test('does not auto-place ships if no placementAI is specified', () => {
  let manualPlayer = new Player();
  expect(manualPlayer.autoPlaceShips()).toBe(false);
  expect(manualPlayer.areAllShipsPlaced()).toBe(false);
});

test('can remove ships', () => {
  let aPlayer = new Player({ shipSpecs: [3, 2] });
  let [shipA, shipB] = aPlayer.shipsToPlace;
  aPlayer.place(shipA, 3, 1, 'horizontal');
  aPlayer.place(shipB, 4, 4, 'vertical');
  aPlayer.remove(shipA);
  expect(aPlayer.placedShips).not.toContain(shipA);
  expect(aPlayer.placedShips).toContain(shipB);
});

test('can remove all ships', () => {
  let aPlayer = new Player({ shipSpecs: [3, 2, 5] });
  let [shipA, shipB, shipC] = aPlayer.shipsToPlace;
  aPlayer.place(shipA, 3, 1, 'horizontal');
  aPlayer.place(shipB, 4, 4, 'vertical');
  aPlayer.place(shipC, 1, 2, 'vertical');
  aPlayer.removeAllShips();
  expect(aPlayer.placedShips).toHaveLength(0);
});

test('notifies for each coordinate pair when placing a ship', () => {
  const X = 1;
  const Y = 5;
  const LENGTH = 4;

  let aPlayer = new Player({ shipSpecs: [LENGTH] });
  let notifyCount = 0;

  aPlayer.subscribe((eventArgs) => {
    if (eventArgs.action == 'place') {
      expect(eventArgs).toHaveProperty('x');
      expect(eventArgs.y).toBe(Y);
      notifyCount += 1;
    }
  });
  aPlayer.place(aPlayer.shipsToPlace[0], X, Y, 'horz');
  expect(notifyCount).toBe(LENGTH);
});

test('notifies for each coordinate pair when removing a ship', () => {
  const X = 6;
  const Y = 2;
  const LENGTH = 3;

  let aPlayer = new Player({ shipSpecs: [LENGTH] });
  let notifyCount = 0;

  aPlayer.subscribe((eventArgs) => {
    if (eventArgs.action == 'remove') {
      expect(eventArgs.x).toBe(X);
      expect(eventArgs).toHaveProperty('y');
      notifyCount += 1;
    }
  });

  let ship = aPlayer.shipsToPlace[0];
  aPlayer.place(ship, X, Y, 'vert');
  aPlayer.remove(ship);
  expect(notifyCount).toBe(LENGTH);
});

// Opponents and attacks

test('mutually sets opponent on init', () => {
  let alice = new Player({ name: 'Alice'});
  let bob = new Player({ name: 'Bob', opponent: alice });
  expect(bob.opponent).toStrictEqual(alice);
  expect(alice.opponent).toStrictEqual(bob);
});

test('mutually sets opponent with property', () => {
  let tom = new Player({name: 'Tom'});
  let jerry = new Player({name: 'Jerry'});

  // No opponent until it's set
  expect(tom.opponent).toBeNull();
  expect(jerry.opponent).toBeNull();

  // Opponents are mutual
  tom.opponent = jerry;
  expect(tom.opponent).toStrictEqual(jerry);
  expect(jerry.opponent).toStrictEqual(tom);
});

test('attacks opponent board', () => {
  let attacker = new Player();
  let defender = new Player({ opponent: attacker });

  const X = 3;
  const Y = 4;
  attacker.attack(X, Y);
  expect(defender.board.hasBeenAttacked(X, Y)).toBe(true);
});

test('auto-attacks if AI present', () => {
  const attacker = new Player({ attackAI: new RandomAttackAI() });
  const defender = new Player({ opponent: attacker });

  const attackResult = attacker.autoAttack();
  expect(attackResult).toHaveProperty('x');
  expect(attackResult).toHaveProperty('y');

  expect(
    defender.board.hasBeenAttacked(attackResult.x, attackResult.y)
  ).toBe(true);
});

test('disallows attacking without opponent', () => {
  let solo = new Player();
  expect(() => solo.attack(1, 1)).toThrow();
});

test('loses if all ships sink', () => {
  let attacker = new Player();
  let defender = new Player({
    opponent: attacker,
    shipSpecs: [2, 2],
  });

  let [shipA, shipB] = defender.shipsToPlace;
  defender.placeHorizontal(shipA, 1, 1);
  defender.placeHorizontal(shipB, 1, 3);

  // Sink defender's first ship
  attacker.attack(1, 1);
  attacker.attack(2, 1);
  expect(defender.loses()).toBe(false);
  expect(attacker.wins()).toBe(false);

  // Sink defender's second and final ship
  attacker.attack(1, 3);
  attacker.attack(2, 3);
  expect(defender.loses()).toBe(true);
  expect(attacker.loses()).toBe(false);
  expect(attacker.wins()).toBe(true);
});

test('notifies with coords and result when attacking', () => {
  const ATTACK_X = 4;
  const ATTACK_Y = 5;

  let attacker = new Player();
  let defender = new Player({ shipSpecs: [4], opponent: attacker });
  let attackerNotifies = false;

  let ship = defender.shipsToPlace[0];

  attacker.subscribe((eventArgs) => {
    if (eventArgs.action == 'attack') {
      expect(eventArgs.x).toBe(ATTACK_X);
      expect(eventArgs.y).toBe(ATTACK_Y);
      expect(eventArgs.result).toBe('hit');
      expect(eventArgs.ship).toStrictEqual(ship);
      attackerNotifies = true;
    }
  });

  defender.place(ship, ATTACK_X, ATTACK_Y, 'horz');
  attacker.attack(ATTACK_X, ATTACK_Y);
  expect(attackerNotifies).toBe(true);
});

test('notifies with coords and result when attacked', () => {
  const ATTACK_X = 1;
  const ATTACK_Y = 0;

  let attacker = new Player();
  let defender = new Player({ shipSpecs: [4], opponent: attacker });
  let defenderNotifies = false;

  let ship = defender.shipsToPlace[0];

  defender.subscribe((eventArgs) => {
    if (eventArgs.action == 'receiveAttack') {
      expect(eventArgs.x).toBe(ATTACK_X);
      expect(eventArgs.y).toBe(ATTACK_Y);
      expect(eventArgs.result).toBe('hit');
      expect(eventArgs.ship).toStrictEqual(ship);
      defenderNotifies = true;
    }
  });

  defender.place(ship, ATTACK_X, ATTACK_Y, 'vert');
  attacker.attack(ATTACK_X, ATTACK_Y);
  expect(defenderNotifies).toBe(true);
});