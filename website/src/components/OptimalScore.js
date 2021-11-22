import { useSelector } from "react-redux";

function OptimalScore() {
  const app = useSelector((state) => state.app);
  const game = useSelector((state) => state.game);
  const maxScore = app.T * game.arms[game.maxArmId].mean;

  return (
    game.gameOver && (
      <div className="game-over-banner">
        <h2>
          {game.maxArmId === game.bestArmId
            ? "Correct best arm selected."
            : "Incorrect best arm selected."}
        </h2>
        <h2>
          Optimial Cumulative Reward: {maxScore.toFixed(4)} with Arm{" "}
          {game.maxArmId}
        </h2>
      </div>
    )
  );
}

export default OptimalScore;
