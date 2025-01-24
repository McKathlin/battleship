import "./style.css";

console.log("index.js loaded!");

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

setupBoardView(
  document.getElementById('player-board'),
  { width: 10, height: 10 }
);

setupBoardView(
  document.getElementById('opponent-board'),
  { width: 10, height: 10 }
);