const API = {
  setup: async (userId, arms, gameType, numArms, numInteractions) => {
    const payload = {
      userId,
      arms,
      gameType,
      numArms: parseInt(numArms),
      numInteractions: parseInt(numInteractions),
    };
    console.log(payload);
    const res = await fetch("/api/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },
  record: async (
    gameId,
    lastRecommend,
    gameType,
    systemState,
    armId,
    reward,
    decision
  ) => {
    const payload = {
      gameId,
      lastRecommend,
      gameType,
      game: systemState,
      armId: parseInt(armId),
      reward: parseFloat(reward),
      decision: parseInt(decision), // 1 if selected 0 if not
    };
    console.log(payload);
    const res = await fetch("/api/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },
  score: async (gameId, finalScore, bestArmGuess) => {
    const payload = {
      gameId,
      finalScore,
      bestArmGuess,
    };
    console.log(payload);
    const res = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },
  leaderboard: async (gameType) => {
    const payload = {
      gameType,
    };
    console.log(payload);
    const res = await fetch("/api/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },
};
export default API;
