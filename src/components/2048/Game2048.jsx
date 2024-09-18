import React, { useState } from "react";

const Game2048 = () => {
  const [board, setBoard] = useState(generateInitialBoard());
  const [score, setScore] = useState(0);

  // Function to generate the initial 4x4 board with two random tiles
  function generateInitialBoard() {
    const newBoard = Array(4).fill().map(() => Array(4).fill(0));
    return addRandomTile(addRandomTile(newBoard));
  }

  // Function to add a random tile (either 2 or 4) in an empty spot
  function addRandomTile(board) {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      const newBoard = board.map((r, rowIndex) =>
        r.map((val, colIndex) =>
          rowIndex === row && colIndex === col ? (Math.random() < 0.9 ? 2 : 4) : val
        )
      );
      return newBoard;
    }

    return board;
  }

  // Handle directional movement (left, right, up, down)
  function move(direction) {
    let movedBoard;
    switch (direction) {
      case "up":
        movedBoard = moveUp(board);
        break;
      case "down":
        movedBoard = moveDown(board);
        break;
      case "left":
        movedBoard = moveLeft(board);
        break;
      case "right":
        movedBoard = moveRight(board);
        break;
      default:
        return;
    }

    if (JSON.stringify(board) !== JSON.stringify(movedBoard)) {
      setBoard(addRandomTile(movedBoard));
    }
  }

  function moveLeft(board) {
    return board.map(row => slideAndMerge(row));
  }

  function moveRight(board) {
    return board.map(row => slideAndMerge(row.reverse()).reverse());
  }

  function moveUp(board) {
    const rotated = rotateLeft(board);
    const moved = rotated.map(row => slideAndMerge(row));
    return rotateRight(moved);
  }

  function moveDown(board) {
    const rotated = rotateLeft(board);
    const moved = rotated.map(row => slideAndMerge(row.reverse()).reverse());
    return rotateRight(moved);
  }

  function slideAndMerge(row) {
    const newRow = row.filter(value => value !== 0); // Remove zeroes
    const mergedRow = [];
    let skip = false;

    for (let i = 0; i < newRow.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
        mergedRow.push(newRow[i] * 2);
        setScore(prev => prev + newRow[i] * 2);
        skip = true;
      } else {
        mergedRow.push(newRow[i]);
      }
    }

    // Fill the remaining spaces with zeroes
    return [...mergedRow, ...Array(4 - mergedRow.length).fill(0)];
  }

  function rotateLeft(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex])).reverse();
  }

  function rotateRight(matrix) {
    return rotateLeft(rotateLeft(rotateLeft(matrix)));
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Score: {score}</h1>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-20 h-20 flex items-center justify-center text-2xl font-bold ${
                tile === 0 ? "bg-gray-300" : `bg-yellow-${Math.min(Math.log2(tile), 7) * 100}`
              }`}
            >
              {tile !== 0 && tile}
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded"
          onClick={() => move("up")}
        >
          Up
        </button>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded"
            onClick={() => move("left")}
          >
            Left
          </button>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded"
            onClick={() => move("right")}
          >
            Right
          </button>
        </div>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded"
          onClick={() => move("down")}
        >
          Down
        </button>
      </div>
    </div>
  );
};

export default Game2048;
