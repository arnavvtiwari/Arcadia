import React, { useState, useEffect } from "react";

const FlappyBird = () => {
  const birdHeight = 40;
  const birdWidth = 40;
  const jumpHeight = 50;
  const gravity = 4;
  const obstacleWidth = 60;
  const obstacleGap = 150;
  const gameHeight = 500;
  const gameWidth = 600;
  const obstacleSpeed = 3;
  const obstacleReset = gameWidth; // Where obstacles start after reset

  const [birdPosition, setBirdPosition] = useState(gameHeight / 2 - birdHeight / 2);
  const [obstaclePosition, setObstaclePosition] = useState(obstacleReset);
  const [topObstacleHeight, setTopObstacleHeight] = useState(100);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Bird falling due to gravity
  useEffect(() => {
    let gravityInterval;
    if (gameStarted && !gameOver && birdPosition < gameHeight - birdHeight) {
      gravityInterval = setInterval(() => {
        setBirdPosition((pos) => pos + gravity);
      }, 24);
    }

    return () => clearInterval(gravityInterval);
  }, [birdPosition, gameStarted, gameOver]);

  // Obstacle movement
  useEffect(() => {
    let obstacleInterval;
    if (gameStarted && !gameOver && obstaclePosition >= -obstacleWidth) {
      obstacleInterval = setInterval(() => {
        setObstaclePosition((pos) => pos - obstacleSpeed);
      }, 24);
    } else if (obstaclePosition < -obstacleWidth) {
      // Reset obstacles and score when passing
      setObstaclePosition(obstacleReset);
      setTopObstacleHeight(Math.random() * (gameHeight - obstacleGap));
      setScore((score) => score + 1);
    }

    return () => clearInterval(obstacleInterval);
  }, [obstaclePosition, gameStarted, gameOver]);

  // Jumping (bird moves up)
  const handleJump = () => {
    if (!gameStarted) setGameStarted(true);

    if (birdPosition > 0) {
      setBirdPosition((pos) => Math.max(0, pos - jumpHeight));
    }
  };

  // Check collision with obstacles or ground
  const checkCollision = () => {
    const bottomObstacleHeight = gameHeight - topObstacleHeight - obstacleGap;

    // Bird hits top or bottom of the screen
    if (birdPosition < 0 || birdPosition > gameHeight - birdHeight) {
      return true;
    }

    // Bird hits an obstacle
    if (
      obstaclePosition <= 140 && // Bird's x-position (100 + bird width)
      obstaclePosition + obstacleWidth >= 100 &&
      (birdPosition < topObstacleHeight || birdPosition > gameHeight - bottomObstacleHeight - birdHeight)
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (checkCollision()) {
      setGameOver(true);
    }
  }, [birdPosition, obstaclePosition]);

  const resetGame = () => {
    setBirdPosition(gameHeight / 2 - birdHeight / 2);
    setObstaclePosition(obstacleReset);
    setTopObstacleHeight(100);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-blue-400"
      onClick={handleJump}
    >
      <div className="relative" style={{ height: gameHeight, width: gameWidth }}>
        {/* Bird */}
        <div
          className="absolute bg-yellow-400"
          style={{
            height: birdHeight,
            width: birdWidth,
            top: birdPosition,
            left: 100, // Fixed bird position
          }}
        />

        {/* Top Obstacle */}
        <div
          className="absolute bg-green-600"
          style={{
            height: topObstacleHeight,
            width: obstacleWidth,
            top: 0,
            left: obstaclePosition,
          }}
        />

        {/* Bottom Obstacle */}
        <div
          className="absolute bg-green-600"
          style={{
            height: gameHeight - topObstacleHeight - obstacleGap,
            width: obstacleWidth,
            bottom: 0,
            left: obstaclePosition,
          }}
        />

        {/* Game Over Message */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-4xl font-bold">Game Over!</p>
            <p className="text-white text-2xl mt-4">Score: {score}</p>
            <button
              className="bg-white text-black px-4 py-2 mt-4"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Score */}
      <div className="mt-4 text-white text-3xl font-bold">Score: {score}</div>
    </div>
  );
};

export default FlappyBird;
