import { useDispatch, useSelector } from "react-redux";
import { setArms, setBudget, setGameType, setSetup } from "../slices/appSlice";

function TypeButton({ type, title }) {
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();
  return (
    <button
      className={app.gameType === type ? "" : "outline"}
      onClick={() => dispatch(setGameType(type))}
      style={{ marginRight: 16 }}
    >
      {title}
    </button>
  );
}

function SetupLayout() {
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();

  return (
    <div className="container">
      <h1>Multi-armed Bandit</h1>
      <div className="input-row">
        <h2>Number of Arms</h2>
        <input
          type="number"
          min="1"
          max="20"
          value={app.K}
          step="1"
          onChange={(event) => dispatch(setArms(event.target.value))}
        />
      </div>
      <div className="input-row">
        <h2>Budget</h2>
        <input
          type="number"
          min="1"
          max="1000"
          value={app.T}
          step="1"
          onChange={(event) => dispatch(setBudget(event.target.value))}
        />
      </div>
      <div>
        <h2>Game Type</h2>
        <TypeButton type={"base"} title="Base Game" />
        <TypeButton
          type={"observe"}
          title="
          Observe"
        />
        <TypeButton
          type={"noObserve"}
          title="
          No Observe"
        />
      </div>
      <button onClick={() => dispatch(setSetup(false))}>Start Game</button>
    </div>
  );
}

export default SetupLayout;
