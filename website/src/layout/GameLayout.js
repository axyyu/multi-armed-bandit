import Game from "../components/Game";

function GameLayout() {
  // const app = useSelector((state) => state.app);

  // switch (app.gameType) {
  //   case "base": {
  //     return <BaseGame />;
  //   }
  //   case "observe": {
  //     return <ObserveGame />;
  //   }
  //   case "noObserve": {
  //     return <NoObserveGame />;
  //   }
  //   default:
  //     return null;
  // }
  return <Game />;
}

export default GameLayout;
