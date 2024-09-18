import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable"; // Import swipeable hooks

const SIZE = 4; // Size of the grid

// Initialize the board with zeros
const initializeBoard = () => {
  const board = Array(SIZE)
    .fill()
    .map(() => Array(SIZE).fill(0));
  return addRandomTile(addRandomTile(board));
};

// Add a random tile (2 or 4) to an empty spot on the board
const addRandomTile = (board) => {
  const emptySpaces = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) emptySpaces.push([row, col]);
    }
  }
  if (emptySpaces.length === 0) return board;
  const [randomRow, randomCol] = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
  return board;
};

// Check if two arrays are equal
const arraysEqual = (arr1, arr2) =>
  arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);

// Handle moving and merging tiles
const slideAndMerge = (row) => {
  let newRow = row.filter((val) => val !== 0); // Remove zeros
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter((val) => val !== 0); // Remove the zeros after merging
  return [...newRow, ...Array(SIZE - newRow.length).fill(0)];
};

// Handle moving the board in a given direction
const move = (board, direction) => {
  let newBoard = [...board];
  if (direction === "left") {
    newBoard = newBoard.map((row) => slideAndMerge(row));
  } else if (direction === "right") {
    newBoard = newBoard.map((row) => slideAndMerge(row.reverse()).reverse());
  } else if (direction === "up") {
    for (let col = 0; col < SIZE; col++) {
      const colArray = newBoard.map((row) => row[col]);
      const newCol = slideAndMerge(colArray);
      newCol.forEach((val, rowIndex) => {
        newBoard[rowIndex][col] = val;
      });
    }
  } else if (direction === "down") {
    for (let col = 0; col < SIZE; col++) {
      const colArray = newBoard.map((row) => row[col]).reverse();
      const newCol = slideAndMerge(colArray).reverse();
      newCol.forEach((val, rowIndex) => {
        newBoard[rowIndex][col] = val;
      });
    }
  }
  return newBoard;
};

const Game2048 = () => {
  const [board, setBoard] = useState(initializeBoard);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = (e) => {
    if (gameOver) return;
    let newBoard;
    switch (e.key) {
      case "ArrowLeft":
        newBoard = move(board, "left");
        break;
      case "ArrowRight":
        newBoard = move(board, "right");
        break;
      case "ArrowUp":
        newBoard = move(board, "up");
        break;
      case "ArrowDown":
        newBoard = move(board, "down");
        break;
      default:
        return;
    }
    if (!arraysEqual(board, newBoard)) {
      setBoard(addRandomTile(newBoard));
    }
  };

  // Swipe handlers for mobile support
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    onSwipedUp: () => handleSwipe("up"),
    onSwipedDown: () => handleSwipe("down"),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const handleSwipe = (direction) => {
    if (gameOver) return;
    let newBoard = move(board, direction);
    if (!arraysEqual(board, newBoard)) {
      setBoard(addRandomTile(newBoard));
    }
  };

  // Check if there are no moves left
  const checkGameOver = () => {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === 0) return false;
        if (row > 0 && board[row][col] === board[row - 1][col]) return false;
        if (col > 0 && board[row][col] === board[row][col - 1]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setGameOver(checkGameOver());
  }, [board]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const tileColors = {
    2: "bg-yellow-100",
    4: "bg-yellow-200",
    8: "bg-yellow-300",
    16: "bg-yellow-400",
    32: "bg-orange-500 text-white",
    64: "bg-orange-600 text-white",
    128: "bg-yellow-500 text-white",
    256: "bg-yellow-600 text-white",
    512: "bg-yellow-700 text-white",
    1024: "bg-yellow-800 text-white",
    2048: "bg-yellow-900 text-white",
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {gameOver && <div className="text-4xl font-bold text-red-600 mb-4">Game Over</div>}
      <div
        {...swipeHandlers} // Apply swipe handlers to the game container
        className="grid grid-cols-4 grid-rows-4 gap-4"
      >
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-24 h-24 flex items-center justify-center font-bold text-xl ${
                tileColors[value] || "bg-gray-300"
              } rounded`}
            >
              {value !== 0 ? value : ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Game2048;
