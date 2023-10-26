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
  setCurrentCategory(
    categoryContext.categories.find((cat) => cat._id === categoryId)
  );

  // You can later add state variables for time left, score, etc.

  //   useEffect(() => {
  //     const category = categories.find((cat) => cat.id === parseInt(categoryId));
  //     setCurrentCategory(category);
  //     if (category && category.words.length) {
  //       setCurrentWord(category.words[0]); // Start with the first word for simplicity
  //     }
  //   }, [categoryId]);

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
        setUsedWords([currentWord]); // Add the currentWord to the usedWords array when starting
      }, 1000);
    }
    return () => clearTimeout(countdownTimer); // Cleanup on unmount
  }, [countdown, currentWord]);

  const startGame = () => {
    // Implement countdown here (or in next steps)
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
    setCurrentWord(currentCategory.words[0]);
  };

  const navigateToMainScreen = () => {
    navigate("/"); // Navigate to the root route
  };

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
            {currentCategory.words.map((word) => (
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
