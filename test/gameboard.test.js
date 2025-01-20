import { GameBoard, Ship } from '../src/battleship.js';

const STANDARD_WIDTH = 10;
const STANDARD_HEIGHT = 10;

test('remembers width and height', () => {
  let WIDTH = 8;
  let HEIGHT = 10;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.width).toBe(WIDTH);
  expect(board.height).toBe(HEIGHT);
});

test(`counts valid coordinates as in bounds`, () => {
  let WIDTH = 9;
  let HEIGHT = 7;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.isInBounds(1, 2)).toBe(true);
  expect(board.isInBounds(0, 0)).toBe(true);
  expect(board.isInBounds(WIDTH - 1, HEIGHT - 1)).toBe(true);
});

test(`counts negative coordinates as out of bounds`, () => {
  let WIDTH = 9;
  let HEIGHT = 7;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.isInBounds(-1, 1)).toBe(false);
  expect(board.isInBounds(-1, -1)).toBe(false);
  expect(board.isInBounds(1, -1)).toBe(false);
  expect(board.isInBounds(-3, 4)).toBe(false);
});

test(`counts too-large coordinates as out of bounds`, () => {
  let WIDTH = 9;
  let HEIGHT = 7;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.isInBounds(WIDTH, 2)).toBe(false);
  expect(board.isInBounds(0, HEIGHT)).toBe(false);
  expect(board.isInBounds(WIDTH + 3, HEIGHT)).toBe(false);
  expect(board.isInBounds(-4, HEIGHT + 1)).toBe(false);
});

test('places horizontally', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let cruiser = new Ship(3);
  board.placeHorizontal(cruiser, 1, 1);
  expect(board.hasShipAt(3, 1)).toBe(true);
});

test('places vertically', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let cruiser = new Ship(3);
  board.placeVertical(cruiser, 1, 1);
  expect(board.hasShipAt(1, 3)).toBe(true);
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
