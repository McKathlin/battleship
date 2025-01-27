import "./style.css";

import { Player } from "./battleship-objects.js";
import { PredeterminedPlacementAI } from "./placementAI.js";

class GridController {
  constructor(containerNode, columnCount, rowCount) {
    this._containerNode = containerNode;
    this._columnCount = columnCount;
    this._rowCount = rowCount;
    this._setupStyle();
    this._cells = this._makeCells();
  }

  cellNodeAt(column, row) {
    let index = (row * this._columnCount) + column;
    return this._cells[index];
  }

  //-- private helpers --

  _setupStyle() {
    const aspectRatio = this._columnCount / this._rowCount;
    this._containerNode.style.setProperty('aspect-ratio', aspectRatio);
    this._containerNode.style.setProperty(
      'grid-template-columns',
      `repeat(${this._columnCount}, 1fr)`
    );
    this._containerNode.style.setProperty(
      'grid-template-rows',
      `repeat(${this._rowCount}, 1fr)`
    );
  }

  _makeCells() {
    let cells = [];
    for (let i = 0; i < this._rowCount; i++) {
      for (let j = 0; j < this._columnCount; j++) {
        let cellNode = document.createElement('div');
        cellNode.classList.add('cell');
        cells.push(cellNode);
        this._containerNode.appendChild(cellNode);
      }
    }
    return cells;
  }
}

const GameController = (function() {
  const _messageNode = document.getElementById('message');

  const _shipBoardNode = document.getElementById('player-board');
  const _attackBoardNode = document.getElementById('opponent-board');

  const setMessage = function(text) {
    _messageNode.innerText = text;
  }

  const startNewGame = function() {
    let player = new Player({
      placementAI: new PredeterminedPlacementAI(),
    });
    
    let opponent = new Player({
      placementAI: new PredeterminedPlacementAI(),
      opponent: player
    });
    
    let shipGridController = new GridController(
      _shipBoardNode,
      player.board.width,
      player.board.height,
    );
    
    let attackGridController = new GridController(
      _attackBoardNode,
      opponent.board.width,
      opponent.board.height,
    );
    
    setMessage("This game is under construction.");
  }

  return {
    setMessage,
    startNewGame,
  };
}());

GameController.startNewGame();




