import { useSelector } from "react-redux";

function OptimalScore() {
  const app = useSelector((state) => state.app);
  const game = useSelector((state) => state.game);
  const armMeans = game.arms.map((arm) => arm.mean);
  const armMax = Math.max(...armMeans);
  const maxScore = app.T * armMax;
  const maxArmIndex = armMeans.indexOf(armMax);

  return (
    <h2>
      Optimial Cumulative Reward: {maxScore.toFixed(4)} with Arm {maxArmIndex}
    </h2>
  );
}

export default OptimalScore;
