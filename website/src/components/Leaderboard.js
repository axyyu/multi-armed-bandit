import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderboard } from "../slices/gameSlice";
import { getUserId } from "../utils/id";
import "./Leaderboard.css";

export default function Leaderboard({ data, color }) {
  const game = useSelector((state) => state.game);
  const dispatch = useDispatch();

  function showLeaderboard() {
    dispatch(getLeaderboard());
  }

  const userId = getUserId();

  return (
    game.gameOver &&
    (game.showLeaderboard ? (
      <div className="leaderboard">
        <h1>Top 10 Scores</h1>
        {game.topScores.map((score, i) => (
          <div
            className={`leaderboard-row ${
              score.gameId === game.gameId ? "from-current-game" : ""
            }`}
          >
            <h4>{i + 1}</h4>
            <p>{score.userId === userId ? "Me" : score.userId}</p>
            <p>{score.score}</p>
          </div>
        ))}
      </div>
    ) : (
      <button onClick={showLeaderboard}>Show Leaderboard</button>
    ))
  );
}
