import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setup, record } from "../slices/gameSlice";
import { setSetup } from "../slices/appSlice";
import OptimalScore from "./OptimalScore";
import Arm from "./Arm";

function Game() {
  const app = useSelector((state) => state.app);
  const game = useSelector((state) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setup());
  }, []);

  function selectArm(armId, decision = 1) {
    dispatch(record({ armId, decision }));
  }

  function reset() {
    dispatch(setSetup(true));
  }

  return game.ready ? (
    <main>
      <button onClick={reset}>Configure Game</button>
      <h2>Budget: {game.budget}</h2>
      <h2>Reward: {game.totalReward.toFixed(4)}</h2>
      <OptimalScore />
      <div className="row">
        {game.arms.map((arm, index) => (
          <Arm
            key={index}
            arm={arm}
            index={index}
            move={selectArm}
            useDecision={
              app.gameType === "observe" || app.gameType === "noObserve"
            }
          />
        ))}
      </div>
    </main>
  ) : (
    <p>Loading game...</p>
  );
}

export default Game;
