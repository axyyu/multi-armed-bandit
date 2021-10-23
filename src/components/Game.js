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

const Game = ({ numArms, initialBudget, reset }) => {
  const [budget, setBudget] = useState(initialBudget);
  const [reward, setReward] = useState(0);

  const [arms, setArms] = useState([]);

  const U = Prob.uniform(0, 1);

  useEffect(() => {
    setBudget(initialBudget);

    const newArms = [];
    for (let i = 0; i < numArms; i++) {
      newArms.push({
        mean: U(),
        stdDev: U(),
        history: [],
      });
    }
    setArms(newArms);
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
  }

  return (
    <main>
      <button onClick={reset}>Back</button>
      <h2>Budget: {budget}</h2>
      <h2>Reward: {reward.toFixed(4)}</h2>

      <div className="row">
        {arms.map((arm, index) => {
          const color = colors[index % colors.length];
          return (
            <div key={index} className="arm">
              <h1>Arm {index}</h1>
              <Histogram data={arm.history} color={color} />
              <button
                disabled={budget <= 0}
                onClick={() => move(index)}
                style={{ backgroundColor: color, color: "white" }}
              >
                Choose Arm {index}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Game;
