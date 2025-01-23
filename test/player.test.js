import { Player, GameBoard } from '../src/battleship.js';

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

  aPlayer.placeHorizontal(anotherShip, 3, 2);
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

