import { Player, GameBoard } from '../src/battleship.js';

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

test('places ships', () => {
  // TODO: design API for ship placement
});

test('loses if all ships sink', () => {
  // TODO: requires players to place ships first
});


