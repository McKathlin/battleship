import { PredeterminedPlacementAI, RandomPlacementAI } from "../src/placementAI.js";
import { Player } from "../src/battleship.js";

test('PredeterminedPlacementAI places all ships', () => {
  expect(placesAllShips(new PredeterminedPlacementAI())).toBe(true);
});

test('RandomPlacementAI places all ships', () => {
  expect(placesAllShips(new RandomPlacementAI())).toBe(true);
});

test('RandomPlacementAI places all ships every time', () => {
  const TEST_COUNT = 50;
  const ai = new RandomPlacementAI();
  for (let i = 0; i < TEST_COUNT; i++) {
    expect(placesAllShips(ai)).toBe(true);
  }
});

function placesAllShips(placementAI) {
  const player = new Player({ placementAI });
  let shipCount = player.shipsToPlace.length;
  placementAI.placeAllShips(player);
  return player.placedShips.length == shipCount &&
    player.shipsToPlace.length == 0;
}