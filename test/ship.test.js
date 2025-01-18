import { Ship } from '../src/battleship.js';

test('remembers its length (3)', () => {
  let LENGTH = 3;
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
