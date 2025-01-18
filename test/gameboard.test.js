import { GameBoard } from '../src/battleship.js';

test('remembers width and height', () => {
  let WIDTH = 8;
  let HEIGHT = 10;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.width).toBe(WIDTH);
  expect(board.height).toBe(HEIGHT);
});

test('remembers position of placed ship', () => {
  // TODO
});

test('disallows ship collisions', () => {
  // TODO
});

test('returns hit ship', () => {
  // TODO
});

test('returns missed coordinates', () => {
  // TODO
});

test('remembers placed ships', () => {
  // TODO
});

test('remembers sunk ships', () => {
  // TODO
});
