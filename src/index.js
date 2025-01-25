import "./style.css";

import { Player } from "./battleship.js";

function setupBoardView(boardNode, gameBoard) {
  const aspectRatio = gameBoard.width / gameBoard.height;
  boardNode.style.setProperty('aspect-ratio', aspectRatio);
  boardNode.style.setProperty(
    'grid-template-columns',
    `repeat(${gameBoard.width}, 1fr)`
  );
  boardNode.style.setProperty(
    'grid-template-rows',
    `repeat(${gameBoard.height}, 1fr)`
  );

  for (let i = 0; i < gameBoard.height; i++) {
    for (let j = 0; j < gameBoard.width; j++) {
      let cellNode = document.createElement('div');
      cellNode.classList.add('cell');
      boardNode.appendChild(cellNode);
    }
  }
}

function setMessage(text) {
  document.getElementById('message').innerText = text;
}

let player = new Player();
let opponent = new Player({ opponent: player });

setupBoardView(
  document.getElementById('player-board'),
  player.board,
);

setupBoardView(
  document.getElementById('opponent-board'),
  opponent.board,
);

setMessage("This game is under construction.");