import React, { useState } from "react";
import "../styles/style.scss";
import Game from "../components/Game";

const K = 3;
const DEFAULT_BUDGET = 10;

const COLORS = [
  "f72585",
  "b5179e",
  "7209b7",
  "560bad",
  "480ca8",
  "3a0ca3",
  "3f37c9",
  "4361ee",
  "4895ef",
  "4cc9f0",
];

const IndexPage = () => {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [numArms, setNumArms] = useState(K);
  const [playing, setPlaying] = useState(true);

  const reset = () => {
    setPlaying(false);
  };

  return (
    <main>
      {playing ? (
        <Game initialBudget={budget} numArms={numArms} reset={reset} />
      ) : (
        <div className="container">
          <h1>Multi-armed Bandit</h1>
          <div className="input-row">
            <h2>Budget</h2>
            <input
              type="number"
              min="1"
              max="1000"
              value={budget}
              step="1"
              onChange={(event) => setBudget(event.target.value)}
            />
          </div>
          <div className="input-row">
            <h2>Number of Arms</h2>
            <input
              type="number"
              min="1"
              max="20"
              value={numArms}
              step="1"
              onChange={(event) => setNumArms(event.target.value)}
            />
          </div>
          <button onClick={() => setPlaying(true)}>Start Game</button>
        </div>
      )}
    </main>
  );
};

export default IndexPage;
