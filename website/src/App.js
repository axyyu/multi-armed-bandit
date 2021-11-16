import { useSelector } from "react-redux";
import SetupLayout from "./layout/SetupLayout";
import GameLayout from "./layout/GameLayout";

function App() {
  const isSetup = useSelector((state) => state.app.isSetup);

  return isSetup ? <SetupLayout /> : <GameLayout />;
}

export default App;
