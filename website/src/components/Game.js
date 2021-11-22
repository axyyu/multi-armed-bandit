import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSetup } from "../slices/appSlice";
import { setup } from "../slices/gameSlice";
import Arm from "./Arm";
import OptimalScore from "./OptimalScore";

function Game() {
  const game = useSelector((state) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setup());
  }, []);

  function reset() {
    dispatch(setSetup(true));
  }

  return game.ready ? (
    <main>
      <button onClick={reset}>Configure Game</button>
      <h1>
        {game.gameOver
          ? "Game Over"
          : game.budget > 0
          ? "Playing game"
          : "Choose the best arm"}
      </h1>

      <h2>Budget: {game.budget}</h2>
      <h2>Reward: {game.totalReward.toFixed(4)}</h2>

      <OptimalScore />

      <div className="row">
        {game.arms.map((arm, index) => (
          <Arm key={index} arm={arm} index={index} />
        ))}
      </div>
    </main>
  ) : (
    <p>Loading game...</p>
  );
}

export default Game;
