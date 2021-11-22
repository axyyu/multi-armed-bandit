import { useDispatch, useSelector } from "react-redux";
import { markBestArm, record } from "../slices/gameSlice";
import "./Arm.css";
import Histogram from "./Histogram";

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

function Arm({ arm, index }) {
  const app = useSelector((state) => state.app);
  const game = useSelector((state) => state.game);
  const dispatch = useDispatch();

  const useDecisionActions =
    app.gameType === "observe" || app.gameType === "noObserve"; // if the user has to make a decision or not
  const chooseBestArm = game.budget <= 0;

  const color = colors[index % colors.length];

  const armAverage =
    arm.history.length > 0
      ? (arm.history.reduce((a, b) => a + b, 0) / arm.history.length).toFixed(4)
      : "N/A";

  function move(decision = 1) {
    dispatch(record({ armId: index, decision }));
  }

  function selectBestArm() {
    dispatch(markBestArm({ armId: index }));
  }

  const armStyle = {
    backgroundColor: color,
    color: "white",
  };

  return (
    <div className="arm">
      <h1>Arm {index}</h1>
      <h4>Average: {armAverage}</h4>
      <Histogram data={arm.history} color={color} />
      <p className="reward">
        {game.lastChoice?.armId === index && game.lastChoice?.decision === 1
          ? `Reward: ${game.lastChoice?.reward.toFixed(4)}`
          : ""}
      </p>

      {game.gameOver ? null : chooseBestArm ? (
        <button onClick={() => selectBestArm()} style={armStyle}>
          Best Arm {index}
        </button>
      ) : useDecisionActions ? (
        game.recommendedArm === index && (
          <div className="button-row">
            <button onClick={() => move(1)} style={armStyle}>
              Yes
            </button>
            <button onClick={() => move(0)} style={armStyle}>
              No
            </button>
          </div>
        )
      ) : (
        <button onClick={() => move(1)} style={armStyle}>
          Choose Arm {index}
        </button>
      )}
    </div>
  );
}

export default Arm;
