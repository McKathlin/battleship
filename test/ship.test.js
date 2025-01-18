import { Ship } from '../src/battleship.js';

test('remembers its length (3)', () => {
  const LENGTH = 3;
  let s = new Ship(LENGTH);
  expect(s.length).toBe(LENGTH);
});

test('remembers its length (4)', () => {
  expect(new Ship(4).length).toBe(4);
});

test('sinks after 1 hit if length is 1', () => {
  let tinyShip = new Ship(1);
  tinyShip.hit();
  expect(tinyShip.isSunk()).toBe(true);
});

test('can take a hit without sinking if length > 1', () => {
  let aShip = new Ship(2);
  aShip.hit();
  expect(aShip.isSunk()).toBe(false);
});

test('sinks after hit count equal to length', () => {
  const LENGTH = 4;
  let longShip = new Ship(LENGTH);
  for (let i = 0; i < LENGTH; i++) {
    expect(longShip.isSunk()).toBe(false);
    longShip.hit();
  }
  expect(longShip.isSunk()).toBe(true);
});