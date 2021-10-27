import React, { useEffect, useState } from "react";
import Prob from "prob.js";
import Histogram from "../components/Histogram";

const colors = [
  "#b5179e",
  "#7209b7",
  "#560bad",
  "#480ca8",
  "#3a0ca3",
  "#3f37c9",
  "#4361ee",
  "#4895ef",
];

const OptimalScore = ({ arms, budget }) => {
  const armMeans = arms.map((arm) => arm.mean);
  const armMax = Math.max(...armMeans);
  const maxScore = budget * armMax;
  const maxArmIndex = armMeans.indexOf(armMax);

  return (
    <h2>
      Optimial Cumulative Reward: {maxScore.toFixed(4)} with Arm {maxArmIndex}
    </h2>
  );
};

const Game = ({ numArms, initialBudget, reset }) => {
  const [budget, setBudget] = useState(initialBudget);
  const [reward, setReward] = useState(0);
  const [arms, setArms] = useState([]);
  const [lastChoice, setLastChoice] = useState(null);

  const U = Prob.uniform(0, 1);

  useEffect(() => {
    setBudget(initialBudget);
    setReward(0);

    const newArms = [];
    for (let i = 0; i < numArms; i++) {
      newArms.push({
        mean: U(),
        stdDev: U(),
        history: [],
      });
    }
    setArms(newArms);
    setLastChoice(null);
  }, [numArms, initialBudget]);

  function move(arm) {
    const { mean, stdDev, history } = arms[arm];
    const G = Prob.normal(mean, stdDev);
    const value = G();

    setBudget(budget - 1);
    setReward(reward + value);

    const newArms = JSON.parse(JSON.stringify(arms));
    newArms[arm].history = [...history, value];
    setArms(newArms);

    setLastChoice({
      arm: arm,
      reward: value,
    });
  }

  const gameOver = budget <= 0;

  return (
    <main>
      <button onClick={reset}>Configure Game</button>
      <h2>Budget: {budget}</h2>
      <h2>Reward: {reward.toFixed(4)}</h2>

      {gameOver && <OptimalScore arms={arms} budget={initialBudget} />}

      <div className="row">
        {arms.map((arm, index) => {
          const color = colors[index % colors.length];
          return (
            <div key={index} className="arm">
              <h1>Arm {index}</h1>
              <Histogram data={arm.history} color={color} />
              <button
                disabled={gameOver}
                onClick={() => move(index)}
                style={{
                  backgroundColor: color,
                  color: "white",
                  opacity: gameOver ? 0.3 : 1,
                }}
              >
                Choose Arm {index}
              </button>
              {lastChoice && lastChoice.arm == index && (
                <p>Reward: {lastChoice.reward.toFixed(4)}</p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Game;
