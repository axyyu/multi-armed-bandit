import Histogram from "./Histogram";
import { useSelector } from "react-redux";
import "./Arm.css";

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

function Arm({
  arm,
  index,
  move, // move function from Game component
  useDecision, // if the user has to make a decision or not
}) {
  const game = useSelector((state) => state.game);
  const color = colors[index % colors.length];

  const gameOver = game.budget <= 0;

  return (
    <div className="arm">
      <h1>Arm {index}</h1>
      <Histogram data={arm.history} color={color} />
      {useDecision ? (
        game.recommendedArm === index && (
          <div className="button-row">
            <button
              disabled={gameOver}
              onClick={() => move(index, 1)}
              style={{
                backgroundColor: color,
                color: "white",
              }}
            >
              Yes
            </button>
            <button
              disabled={gameOver}
              onClick={() => move(index, 0)}
              style={{
                backgroundColor: color,
                color: "white",
              }}
            >
              No
            </button>
          </div>
        )
      ) : (
        <button
          disabled={gameOver}
          onClick={() => move(index, 1)}
          style={{
            backgroundColor: color,
            color: "white",
          }}
        >
          Choose Arm {index}
        </button>
      )}
      {game.lastChoice?.armId === index && game.lastChoice?.decision === 1 && (
        <p>Reward: {game.lastChoice?.reward.toFixed(4)}</p>
      )}
    </div>
  );
}

export default Arm;
