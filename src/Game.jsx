
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./Game.css";

const GAME_TIME = 30;
const TOTAL_HOLES = 9;

// Generate random hole position
function getRandomHole() {
  return Math.floor(Math.random() * TOTAL_HOLES);
}

function Game() {

  // Game states
  const [hasStarted, setHasStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const [moleIndex, setMoleIndex] = useState(null);

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(GAME_TIME);

  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [computerHits, setComputerHits] = useState(0);

  // Derived game status
  const gameOver = hasStarted && timeLeft === 0;

  const winner =
    playerScore > computerScore
      ? "player"
      : computerScore > playerScore
      ? "computer"
      : "draw";

  // Start or restart game
  const handleStart = () => {
    setMoleIndex(null);

    setPlayerScore(0);
    setComputerScore(0);

    setTimeLeft(GAME_TIME);

    setHits(0);
    setMisses(0);
    setComputerHits(0);

    setGameKey((previousKey) => previousKey + 1);
    setHasStarted(true);
  };

  // Mole movement
  useEffect(() => {

    if (!hasStarted || timeLeft === 0) {
      return;
    }

    const moleTimer = setInterval(() => {
      setMoleIndex(getRandomHole());
    }, 750);

    return () => clearInterval(moleTimer);

  }, [hasStarted, gameKey, timeLeft]);


  // Countdown timer
  useEffect(() => {

    if (!hasStarted || timeLeft === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previousTime) =>
        Math.max(previousTime - 1, 0)
      );
    }, 1000);

    return () => clearTimeout(timer);

  }, [hasStarted, gameKey, timeLeft]);


  // Computer automatically attempts to hit moles
  useEffect(() => {

    if (!hasStarted || timeLeft === 0) {
      return;
    }

    const computerTimer = setInterval(() => {

      // Medium difficulty: 55% chance of scoring
      const computerWins = Math.random() < 0.55;

      if (computerWins) {
        setComputerScore((previousScore) => previousScore + 10);
        setComputerHits((previousHits) => previousHits + 1);
      }

    }, 1000);

    return () => clearInterval(computerTimer);

  }, [hasStarted, gameKey, timeLeft]);


  // Handle player clicking a hole
  const handleHoleClick = (index) => {

    if (!hasStarted || gameOver) {
      return;
    }

    if (moleIndex === index) {

      // Successful hit
      setPlayerScore((previousScore) => previousScore + 10);

      setHits((previousHits) => previousHits + 1);

      // Hide mole after successful hit
      setMoleIndex(null);

    } else {

      // Missed click
      setMisses((previousMisses) => previousMisses + 1);

    }

  };


  // Restart game
  const handleRestart = () => {
    handleStart();
  };


  return (
    <section className="game-container">

      {/* Game heading */}
      <div className="game-heading">

        <div>
          <span className="difficulty-badge">
            MEDIUM LEVEL
          </span>

          <h2>Catch the Mole!</h2>

          <p>
            Hit as many moles as possible before time runs out.
          </p>
        </div>

        <button
          className="restart-btn"
          onClick={handleRestart}
        >
          ↻ Restart
        </button>

      </div>


      {/* Scoreboard */}
      <div className="scoreboard">

        <div className="score-card player-card">

          <div className="score-avatar">🧑</div>

          <div>
            <p>Your Score</p>
            <h2>{playerScore}</h2>
          </div>

        </div>


        <div className="timer-card">

          <span>⏱️</span>

          <p>Time Left</p>

          <h2 className={timeLeft <= 10 ? "time-warning" : ""}>
            00:{String(timeLeft).padStart(2, "0")}
          </h2>

        </div>


        <div className="score-card computer-card">

          <div className="score-avatar">🤖</div>

          <div>
            <p>Computer Score</p>
            <h2>{computerScore}</h2>
          </div>

        </div>

      </div>


      {/* Game status */}
      <div className="game-status">

        {!hasStarted ? (
          <h3>Ready to Play? 🎮</h3>
        ) : gameOver ? (
          <h3>Game Finished! 🏁</h3>
        ) : (
          <h3>🔨 Hit the mole as fast as you can!</h3>
        )}

        <p>
          Every successful hit earns 10 points.
        </p>

      </div>


      {/* Game Board */}
      <div className={`game-board ${
        !hasStarted || gameOver ? "board-disabled" : ""
      }`}>

        {Array.from({ length: TOTAL_HOLES }, (_, index) => (

          <button
            key={index}
            className={`hole ${
              moleIndex === index && hasStarted && !gameOver
                ? "mole-active"
                : ""
            }`}
            onClick={() => handleHoleClick(index)}
            disabled={!hasStarted || gameOver}
            aria-label={`Game hole ${index + 1}`}
          >

            <span className="hole-shadow"></span>

            {moleIndex === index && hasStarted && !gameOver && (
              <span className="mole">🐹</span>
            )}

            <span className="hole-number">
              {index + 1}
            </span>

          </button>

        ))}

      </div>


      {/* Start game */}
      {!hasStarted && (

        <div className="game-overlay-message">

          <div className="overlay-icon">🐹</div>

          <h2>Let's Play!</h2>

          <p>Get ready to catch the moles.</p>

          <button
            className="start-btn"
            onClick={handleStart}
          >
            ▶ Start Game
          </button>

        </div>

      )}


      {/* Game over */}
      {gameOver && (

        <div className={`result-message ${
          winner === "player"
            ? "win-message"
            : winner === "computer"
            ? "lose-message"
            : "draw-message"
        }`}>

          <div className="result-icon">
            {winner === "player"
              ? "🏆"
              : winner === "computer"
              ? "🤖"
              : "🤝"}
          </div>

          <h2>
            {winner === "player"
              ? "You Won!"
              : winner === "computer"
              ? "Computer Won!"
              : "It's a Draw!"}
          </h2>

          <p>
            {winner === "player"
              ? "Amazing! You defeated the computer."
              : winner === "computer"
              ? "The computer scored more points. Try again!"
              : "Both players scored equally!"}
          </p>

          <div className="final-score">
            <span>You: {playerScore}</span>
            <span>Computer: {computerScore}</span>
          </div>

          <button
            className="play-again-btn"
            onClick={handleRestart}
          >
            🔄 Play Again
          </button>

        </div>

      )}


      {/* Statistics */}
      <div className="statistics">

        <div className="stat-item">
          <span>🎯</span>
          <p>Your Hits</p>
          <h3>{hits}</h3>
        </div>

        <div className="stat-item">
          <span>❌</span>
          <p>Your Misses</p>
          <h3>{misses}</h3>
        </div>

        <div className="stat-item">
          <span>🤖</span>
          <p>Computer Hits</p>
          <h3>{computerHits}</h3>
        </div>

      </div>


      {/* Instructions */}
      <div className="instructions">

        <h3>📖 How to Play?</h3>

        <ul>
          <li>🐹 Moles will appear randomly in the 9 holes.</li>
          <li>🔨 Click the mole to earn 10 points.</li>
          <li>❌ Clicking an empty hole counts as a miss.</li>
          <li>🤖 The computer attempts to score automatically.</li>
          <li>⏱️ You have 30 seconds to beat the computer.</li>
          <li>🏆 The player with the highest score wins!</li>
        </ul>

      </div>

    </section>
  );
}

export default Game;
