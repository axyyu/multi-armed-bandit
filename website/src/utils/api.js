const API = {
  setup: async (gameType, numArms, numInteractions) => {
    const payload = {
      gameType: gameType,
      numArms: numArms,
      numInteractions: numInteractions,
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
  recommend: async (gameType, systemState) => {
    const payload = {
      gameType: gameType,
      game: systemState,
    };
    console.log(payload);
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },
  record: async (gameType, systemState, armId, reward, decision) => {
    const payload = {
      gameType: gameType,
      game: systemState,
      armId: armId,
      reward: reward,
      decision: decision, // 1 if selected 0 if not
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
};
export default API;
