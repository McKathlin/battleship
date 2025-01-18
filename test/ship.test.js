import { Ship } from '../src/battleship.js';

test('remembers its length (3)', () => {
  let LENGTH = 3;
  let s = new Ship(LENGTH);
  expect(s.length).toBe(LENGTH);
});

test('remembers its length (4)', () => {
  expect(new Ship(4).length).toBe(4);
});

