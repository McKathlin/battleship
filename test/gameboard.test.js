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

test('counts valid coordinates as in bounds', () => {
  let WIDTH = 9;
  let HEIGHT = 7;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.isInBounds(1, 2)).toBe(true);
  expect(board.isInBounds(0, 0)).toBe(true);
  expect(board.isInBounds(WIDTH - 1, HEIGHT - 1)).toBe(true);
});

test('counts negative coordinates as out of bounds', () => {
  let WIDTH = 9;
  let HEIGHT = 7;
  let board = new GameBoard(WIDTH, HEIGHT);
  expect(board.isInBounds(-1, 1)).toBe(false);
  expect(board.isInBounds(-1, -1)).toBe(false);
  expect(board.isInBounds(1, -1)).toBe(false);
  expect(board.isInBounds(-3, 4)).toBe(false);
});

test('counts too-large coordinates as out of bounds', () => {
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
  expect(board.canPlaceHorizontal(cruiser, 1, 1)).toBe(true);
  board.placeHorizontal(cruiser, 1, 1);
  expect(board.hasShipAt(3, 1)).toBe(true);
  expect(board.shipAt(3, 1)).toStrictEqual(cruiser);
  expect(board.hasShipAt(1, 3)).toBe(false);
});

test('places vertically', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let cruiser = new Ship(3);
  expect(board.canPlaceVertical(cruiser, 1, 1)).toBe(true);
  board.placeVertical(cruiser, 1, 1);
  expect(board.hasShipAt(1, 3)).toBe(true);
  expect(board.shipAt(1, 3)).toStrictEqual(cruiser);
  expect(board.hasShipAt(3, 1)).toBe(false);
});

test('disallows placing ship horizontally out of bounds', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let carrier = new Ship(5);

  expect(board.canPlaceHorizontal(carrier, STANDARD_WIDTH - 4, 1)).toBe(false);
  expect(() => { board.placeHorizontal(carrier, STANDARD_WIDTH - 4, 1); }).toThrow();

  expect(board.canPlaceHorizontal(carrier, 1, -1)).toBe(false);
  expect(() => { board.placeHorizontal(carrier, 1, -1); }).toThrow();
});

test('disallows placing ship vertically out of bounds', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let carrier = new Ship(5);
  
  expect(board.canPlaceVertical(carrier, 2, STANDARD_HEIGHT - 4)).toBe(false);
  expect(() => { board.placeVertical(carrier, 2, STANDARD_HEIGHT - 4); }).toThrow();

  expect(board.canPlaceVertical(carrier, 1, -1)).toBe(false);
  expect(() => { board.placeVertical(carrier, 1, -1); }).toThrow();
});

test('allows placing two adjacent ships', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let carrier = new Ship(5);
  let destroyer = new Ship(2);

  board.placeHorizontal(carrier, 1, 1);
  expect(board.canPlaceVertical(destroyer, 2, 2)).toBe(true);
  expect(() => board.placeVertical(destroyer, 2, 2)).not.toThrow();
});

test('disallows ship collisions', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let carrier = new Ship(5);
  let destroyer = new Ship(2);

  board.placeHorizontal(carrier, 1, 1);
  expect(board.canPlaceVertical(destroyer, 2, 0)).toBe(false);
  expect(() => board.placeVertical(destroyer, 2, 0)).toThrow();
});

test('remembers attack coords', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);

  const X = 1;
  const Y = 2;
  expect(board.hasBeenAttacked(X, Y)).toBe(false);
  expect(board.canBeAttacked(X, Y)).toBe(true);

  board.receiveAttack(X, Y);
  expect(board.hasBeenAttacked(X, Y)).toBe(true);
  expect(board.canBeAttacked(X, Y)).toBe(false);
});

test('returns hit ship', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let otherShip = new Ship(3);
  let targetShip = new Ship(3);
  board.placeHorizontal(otherShip, 0, 0);
  board.placeVertical(targetShip, 1, 1);

  let attackInfo = board.receiveAttack(1, 3);
  expect(attackInfo.hitShip).toStrictEqual(targetShip);
  expect(targetShip.hitCount).toBe(1);
});

test('returns missed coordinates', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let aShip = new Ship(3);

  board.placeHorizontal(aShip, 4, 2);

  const ATTACK_X = 4;
  const ATTACK_Y = 3;
  let attackInfo = board.receiveAttack(ATTACK_X, ATTACK_Y);
  expect(attackInfo.hitShip).toBe(null);
  expect(attackInfo.x).toBe(ATTACK_X);
  expect(attackInfo.y).toBe(ATTACK_Y);
});

test('disallows attacking same coordinates twice', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let targetShip = new Ship(3);
  board.placeHorizontal(targetShip, 1, 2);

  const HIT_X = 3;
  const HIT_Y = 2;
  let attackInfo = board.receiveAttack(HIT_X, HIT_Y);
  expect(attackInfo.hitShip).toStrictEqual(targetShip);
  expect(targetShip.hitCount).toBe(1);

  expect(board.canBeAttacked(HIT_X, HIT_Y)).toBe(false);
  expect(() => board.receiveAttack(HIT_X, HIT_Y)).toThrow();
});

test('remembers placed ships', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let aShip = new Ship(3);
  let anotherShip = new Ship(2);
  let aShipNotPlaced = new Ship(3);
  board.placeVertical(aShip, 0, 0);
  board.placeHorizontal(anotherShip, 2, 1);

  expect(board.ships).toHaveLength(2);
  expect(board.ships).toContain(aShip);
  expect(board.ships).toContain(anotherShip);
  expect(board.ships).not.toContain(aShipNotPlaced);
});

test('remembers sunk ships', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let sparedShip = new Ship(3);
  let targetShip = new Ship(2);
  board.placeHorizontal(sparedShip, 0, 0);
  board.placeVertical(targetShip, 1, 1);

  expect(board.sunkShips).toHaveLength(0);

  // Sink target ship
  board.receiveAttack(1, 1);
  board.receiveAttack(1, 2);

  // Hit spared ship, but don't sink it
  board.receiveAttack(0, 0);

  expect(board.sunkShips).toHaveLength(1);
  expect(board.sunkShips).toContain(targetShip);
  expect(board.sunkShips).not.toContain(sparedShip);
});

test('remembers surviving ships', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let sparedShip = new Ship(3);
  let targetShip = new Ship(2);
  board.placeHorizontal(sparedShip, 0, 0);
  board.placeVertical(targetShip, 1, 1);

  expect(board.survivingShips).toHaveLength(2);

  // Sink target ship
  board.receiveAttack(1, 1);
  board.receiveAttack(1, 2);

  // Hit spared ship, but don't sink it
  board.receiveAttack(0, 0);

  expect(board.survivingShips).toHaveLength(1);
  expect(board.survivingShips).toContain(sparedShip);
  expect(board.survivingShips).not.toContain(targetShip);
});