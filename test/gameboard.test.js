import { GameBoard, Ship } from '../src/battleship-objects.js';

const STANDARD_WIDTH = 10;
const STANDARD_HEIGHT = 10;

// Dimensions and Bounds

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

// Ship placement

test('remembers placed ships', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let shipA = new Ship(4);
  let shipB = new Ship(3);
  let shipC = new Ship(2);
  
  board.place(shipA, 1, 1, 'vert');
  board.place(shipB, 3, 2, 'horz');
  board.place(shipC, 5, 5, 'vert');

  expect(board.ships).toContain(shipA);
  expect(board.ships).toContain(shipB);
  expect(board.ships).toContain(shipC);
})

test('places with the current orientation', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let s = new Ship(4);
  s.orientation = 'horizontal';
  expect(board.canPlace(s, 2, 0)).toBe(true);
  board.place(s, 2, 0);
  expect(board.hasShipAt(5, 0)).toBe(true);
  expect(s.isPlaced()).toBe(true);
});

test('places with an entered orientation', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let s = new Ship(4);
  s.orientation = 'horizontal';
  expect(board.canPlace(s, 2, 0, 'vertical')).toBe(true);
  board.place(s, 2, 0, 'vertical');
  expect(board.hasShipAt(2, 3)).toBe(true);
  expect(s.isPlaced()).toBe(true);
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

test('allows removing a ship from the board', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let aShip = new Ship(3);

  board.place(aShip, 1, 1, 'vertical');
  expect(board.shipAt(1, 3)).toStrictEqual(aShip);

  expect(board.remove(aShip)).toBeTruthy();
  expect(board.shipAt(1, 3)).toBeFalsy();
  expect(aShip.isPlaced()).toBe(false);
  expect(board.ships).not.toContain(aShip);
});

test('signals failure on attempt to remove a not-placed ship', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let missingShip = new Ship(3);

  expect(board.remove(missingShip)).toBeFalsy();
});

test('allows changing the placement of a ship', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  let movingShip = new Ship(4);

  board.place(movingShip, 2, 0, 'vert');
  expect(board.canPlace(movingShip, 0, 1, 'horz')).toBe(true);

  board.place(movingShip, 0, 1, 'horz');
  expect(board.shipAt(3, 1)).toStrictEqual(movingShip);

  // Also make sure ship's old position is vacated
  expect(board.shipAt(2, 0)).toBeFalsy();
});

// Attacks

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

test('detects all ships sunk', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);

  let shipA = new Ship(3);
  let shipB = new Ship(2);
  board.placeHorizontal(shipA, 0, 0);
  board.placeVertical(shipB, 1, 1);

  // Sink Ship A
  board.receiveAttack(0, 0);
  board.receiveAttack(1, 0);
  board.receiveAttack(2, 0);

  expect(board.areAllShipsSunk()).toBe(false);

  // Sink Ship B
  board.receiveAttack(1, 1);
  board.receiveAttack(1, 2);

  expect(board.areAllShipsSunk()).toBe(true);
});

test('does not report all ships as sunk if none have been placed', () => {
  let board = new GameBoard(STANDARD_WIDTH, STANDARD_HEIGHT);
  expect(board.areAllShipsSunk()).toBe(false);
});
