import { Ship } from '../src/battleship-objects.js';

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

// length

test('remembers its length (3)', () => {
  const LENGTH = 3;
  let s = new Ship(LENGTH);
  expect(s.length).toBe(LENGTH);
});

test('remembers its length (4)', () => {
  expect(new Ship(4).length).toBe(4);
});

// hits and sinking

test('remembers hitCount', () => {
  let myShip = new Ship(3);
  myShip.hit();
  myShip.hit();
  expect(myShip.hitCount).toBe(2);
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

// orientation and rotation

test('starts horizontal', () => {
  const LENGTH = 3;
  let aShip = new Ship(LENGTH);
  expect(aShip.orientation).toBe(HORIZONTAL);
});

test('normalizes orientation text', () => {
  let aShip = new Ship(2);
  aShip.orientation = HORIZONTAL;
  expect(aShip.orientation).toBe(HORIZONTAL);
  aShip.orientation = 'V';
  expect(aShip.orientation).toBe(VERTICAL);
  aShip.orientation = 'horz';
  expect(aShip.orientation).toBe(HORIZONTAL);
});

test('rotates to vertical and back', () => {
  let aShip = new Ship(4);
  aShip.orientation = HORIZONTAL;

  aShip.rotate();
  expect(aShip.orientation).toBe(VERTICAL);
  expect(aShip.isVertical()).toBe(true);
  expect(aShip.isHorizontal()).toBe(false);

  aShip.rotate();
  expect(aShip.orientation).toBe(HORIZONTAL);
  expect(aShip.isVertical()).toBe(false);
  expect(aShip.isHorizontal()).toBe(true);
});

test('has length x 1 dimensions when horizontal', () => {
  const LENGTH = 5;
  let aShip = new Ship(LENGTH);

  aShip.orientation = HORIZONTAL;
  expect(aShip.height).toBe(1);
  expect(aShip.width).toBe(LENGTH);
});

test('has 1 x length dimensions when vertical', () => {
  const LENGTH = 5;
  let aShip = new Ship(LENGTH);

  aShip.orientation = VERTICAL;
  expect(aShip.height).toBe(LENGTH);
  expect(aShip.width).toBe(1);
});

// placement

test('remembers whether it has been placed', () => {
  let aShip = new Ship(3);
  expect(aShip.isPlaced()).toBe(false);

  aShip.place(4, 2);
  expect(aShip.isPlaced()).toBe(true);
});

test('remembers placement coordinates', () => {
  const X = 3;
  const Y = 5;
  let aShip = new Ship(2);
  aShip.place(X, Y);
  expect(aShip.x).toBe(X);
  expect(aShip.y).toBe(Y);
});

test('has negative coordinates before it is placed', () => {
  let aShip = new Ship(3);
  expect(aShip.x).toBeLessThan(0);
  expect(aShip.y).toBeLessThan(0);
});

test('places horizontally on request', () => {
  let aShip = new Ship(4);
  aShip.place(2, 0, HORIZONTAL);
  expect(aShip.orientation).toBe(HORIZONTAL);
});

test('places vertically on request', () => {
  let aShip = new Ship(4);
  aShip.place(2, 0, VERTICAL);
  expect(aShip.orientation).toBe(VERTICAL);
});

test('keeps previous orientation when placed with no orientation given', () => {
  let aShip = new Ship(3);
  aShip.orientation = VERTICAL;
  aShip.place(1, 5);
  expect(aShip.orientation).toBe(VERTICAL);
});

test('undoes placement with remove()', () => {
  let aShip = new Ship(3);
  aShip.place(1, 2);
  aShip.remove();
  expect(aShip.isPlaced()).toBe(false);
  expect(aShip.x).toBeLessThan(0);
  expect(aShip.y).toBeLessThan(0);
});

test('can be re-placed', () => {
  let skippy = new Ship(4);

  skippy.place(1, 2, VERTICAL);
  expect(skippy.x).toBe(1);
  expect(skippy.y).toBe(2);
  expect(skippy.isVertical()).toBe(true);

  skippy.place(4, 3, HORIZONTAL);
  expect(skippy.x).toBe(4);
  expect(skippy.y).toBe(3);
  expect(skippy.isVertical()).toBe(false);
  expect(skippy.isPlaced()).toBe(true);
});

test('cannot be rotated in place', () => {
  let twitchy = new Ship(3);

  twitchy.place(2, 3, VERTICAL);
  expect(() => skippy.rotate()).toThrow();
  expect(() => skippy.orientation = 'horizontal').toThrow();
});

test('returns correct horizontal coordinate list', () => {
  let s = new Ship(4);
  s.place(1, 5, 'horizontal');
  expect(s.getPlacedCoordinates()).toEqual([
    { x: 1, y: 5 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 4, y: 5 },
  ]);
});

test('returns correct vertical coordinate list', () => {
  let s = new Ship(3);
  s.place(2, 2, 'vertical');
  expect(s.getPlacedCoordinates()).toEqual([
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
  ]);
});

test('returns empty coordinate list for unplaced ship', () => {
  let s = new Ship(3);
  expect(s.getPlacedCoordinates()).toEqual([]);
});

test('builds prospective coordinate list using current orientation', () => {
  let s = new Ship(3);
  s.orientation = 'vertical';
  expect(s.getPlacedCoordinatesFrom(3, 1)).toEqual([
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 3 },
  ]);
});

test('builds prospective coordinate list using specified orientation', () => {
  let s = new Ship(3);
  s.orientation = 'vertical';
  expect(s.getPlacedCoordinatesFrom(3, 2, 'horz')).toEqual([
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
  ]);
});

