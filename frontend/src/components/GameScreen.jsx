import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryContext from "./CategoryContext";

const GameScreen = () => {
  const { categoryId } = useParams();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const [gameState, setGameState] = useState("not-started");
  const [timeLeft, setTimeLeft] = useState(60); // Default time of 60 seconds.
  const [score, setScore] = useState(0);
  const [answeredWords, setAnsweredWords] = useState([]);
  const navigate = useNavigate(); // This will allow us to navigate between screens
  const [countdown, setCountdown] = useState(null); // null means no countdown
  const categoryContext = React.useContext(CategoryContext); // <-- Use the context here
  console.log(categoryContext);
  console.log(categoryId);

  useEffect(() => {
    setCurrentCategory(
      categoryContext.categories.find((category) => category._id === categoryId)
    );
  }, [categoryId, categoryContext.categories]);
  console.log(currentCategory);

  useEffect(() => {
    let timerInterval;
    if (gameState === "running") {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            endGame();
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, [gameState]);

  useEffect(() => {
    let countdownTimer;
    if (countdown === "Ready") {
      countdownTimer = setTimeout(() => setCountdown(3), 1000);
    } else if (countdown === 3) {
      countdownTimer = setTimeout(() => setCountdown(2), 1000);
    } else if (countdown === 2) {
      countdownTimer = setTimeout(() => setCountdown(1), 1000);
    } else if (countdown === 1) {
      countdownTimer = setTimeout(() => {
        setCountdown(null);
        setGameState("running");
        moveToNextWord();
      }, 1000);
    }
    return () => clearTimeout(countdownTimer); // Cleanup on unmount
  }, [countdown, currentWord]);

  const startGame = () => {
    const randomIndex = Math.floor(
      Math.random() * currentCategory.words.length
    );
    setCurrentWord(currentCategory.words[randomIndex]);
    setCountdown("Ready");
  };

  const markCorrect = () => {
    setAnsweredWords((prevWords) => [...prevWords, currentWord]);
    setScore((prevScore) => prevScore + 1);
    moveToNextWord();
  };

  const pass = () => {
    moveToNextWord();
  };

  const moveToNextWord = () => {
    const remainingWords = currentCategory.words.filter(
      (word) => !usedWords.includes(word)
    );
    if (remainingWords.length) {
      const randomIndex = Math.floor(Math.random() * remainingWords.length);
      const nextWord = remainingWords[randomIndex];
      setCurrentWord(nextWord);
      setUsedWords((prevWords) => [...prevWords, nextWord]);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("ended");
    // Here you can also handle showing the score and results
  };

  const resetGame = () => {
    setGameState("not-started");
    setScore(0);
    setUsedWords([]);
    setAnsweredWords([]);
    setTimeLeft(60);
  };

  const navigateToMainScreen = () => {
    navigate("/"); // Navigate to the root route
  };

  const handleDeviceOrientation = (event) => {
    const { beta } = event;

    // Tilted forward past 45 degrees
    if (beta < -45) {
      markCorrect();
    }
    // Tilted backward past 45 degrees
    else if (beta > 45) {
      pass();
    }
  };

  useEffect(() => {
    if (gameState === "running") {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    } else {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    }

    // Cleanup
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [gameState]);

  return (
    <div>
      {((gameState === "not-started" && !countdown) ||
        gameState === "ended") && (
        <h1>{currentCategory ? currentCategory.name : "Loading..."}</h1>
      )}
      {gameState === "not-started" && !countdown && (
        <div>
          <button onClick={startGame}>Start</button>
          <button onClick={navigateToMainScreen}>Back to Main Screen</button>
        </div>
      )}
      {gameState === "not-started" && countdown && <h2>{countdown}</h2>}
      {gameState === "running" && (
        <div>
          <div>Time left: {timeLeft} seconds</div>
          <h2>{currentWord}</h2>
          <button onClick={markCorrect}>Correct</button>
          <button onClick={pass}>Pass</button>
        </div>
      )}
      {gameState === "ended" && (
        <div>
          <h2>Game Over</h2>
          <p>Your Score: {score}</p>
          <ul>
            {usedWords.map((word) => (
              <li
                key={word}
                style={{ opacity: answeredWords.includes(word) ? 1 : 0.5 }}
              >
                {word}
              </li>
            ))}
          </ul>
          <button onClick={resetGame}>Restart</button>
          <button onClick={navigateToMainScreen}>Back to Main Screen</button>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
