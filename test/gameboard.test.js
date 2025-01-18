import { GameBoard } from '../src/battleship.js';

test('remembers width and height', () => {
  let WIDTH = 8;
  let HEIGHT = 10;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.width).toBe(WIDTH);
  expect(board.height).toBe(HEIGHT);
});