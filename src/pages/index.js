import React, { useEffect, useState } from "react";
import Prob from "prob.js";
import { Bar } from "react-chartjs-2";
import Chart from "react-google-charts";

import "../styles/style.scss";

const K = 3;
const DEFAULT_BUDGET = 10;
const DEFAULT_REWARD = 0;

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
  const [reward, setReward] = useState(DEFAULT_REWARD);
  const [arms, setArms] = useState([]);

  const U = Prob.uniform(0, 1);

  function reset() {
    setBudget(DEFAULT_BUDGET);
    setReward(DEFAULT_REWARD);

    const newArms = [];
    for (let i = 0; i < K; i++) {
      newArms.push({
        mean: U(),
        stdDev: U(),
        history: [],
      });
    }
    setArms(newArms);
  }

  function move(arm) {
    const { mean, stdDev, history } = arms[arm];
    const G = Prob.normal(mean, stdDev);
    const value = G();

    setBudget(budget - 1);
    setReward(reward + value);

    const newArms = JSON.parse(JSON.stringify(arms));
    newArms[arm].history = [...history, [value]];
    console.log(newArms);
    setArms(newArms);
  }

  useEffect(() => {
    reset();
  }, []);

  return (
    <main>
      <h1>Multi-armed Bandit</h1>
      <h2>Remaining Moves: {budget}</h2>
      <h2>Reward: {reward.toFixed(5)}</h2>
      <div className="row">
        {arms.map((arm, index) => {
          console.log([["Reward"], ...arm.history]);
          return (
            <div key={index} className="arm">
              <h1>Arm {index}</h1>
              <Chart
                height={"400px"}
                width={"400px"}
                chartType="Histogram"
                loader={<div>Loading Chart</div>}
                data={[["Reward"], ...arm.history]}
                options={{
                  legend: { position: "none" },
                  colors: [COLORS[index]],
                }}
                rootProps={{ "data-testid": { index } }}
              />

              <button onClick={() => move(index)}>Choose Arm {index}</button>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default IndexPage;
