import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Prob from "prob.js";
import API from "../utils/api";
import { getUserId } from "../utils/id";

const initialState = {
  ready: false,
  numArms: 0, // number of arms
  budget: 0, // number of remaining interactions
  totalReward: 0, // total reward amount
  lastChoice: null, // last decision made
  systemState: null, // serialized system state
  arms: [], // state of individual arms,
  recommendedArm: null, // if arm is recommended
  gameOver: false,
  bestArmId: false,
  maxArmId: null,
  gameId: null,
};

export const setup = createAsyncThunk("setup", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const { K, T, gameType } = state.app;
  const arms = createArms(K);

  thunkAPI.dispatch(init({ K, T, arms }));

  const userId = getUserId();

  const res = await API.setup(userId, arms, gameType, K, T);
  return res;
});

export const record = createAsyncThunk("record", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const { gameType } = state.app;
  const { arms, systemState, gameId, recommendedArm } = state.game;
  const { armId, decision } = payload;

  // Calculate reward
  const { mean, stdDev } = arms[armId];
  const G = Prob.normal(mean, stdDev);
  const reward = decision === 1 ? G() : 0;

  // Update state
  thunkAPI.dispatch(move({ armId, decision, reward }));

  const res = await API.record(
    gameId,
    recommendedArm,
    gameType,
    systemState,
    armId,
    reward,
    decision
  );
  return res;
});

export const score = createAsyncThunk("score", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const { gameId, totalReward } = state.game;
  const bestArmGuess = payload.armId;

  await API.score(gameId, totalReward, bestArmGuess);
  return { armId: bestArmGuess };
});

function atLeastOneLessThanZero(arms) {
  // if one arm's mean - stdDev is less than 0
  return arms.some((arm) => arm.mean - arm.stdDev < 0);
}

function randomArm() {
  // returns empty arm
  const U = Prob.uniform(0, 1);
  return {
    mean: U(),
    stdDev: U(),
    history: [],
  };
}

function createArms(K) {
  // initializes game state and generates arms
  const arms = [];
  for (let i = 0; i < K; i++) {
    arms.push(randomArm());
  }

  // guarantees that at least one arm's mean - stdDev is smaller than zero
  while (!atLeastOneLessThanZero(arms)) {
    arms.pop(); // remove one arm
    arms.push(randomArm());
  }
  return arms;
}

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    init: (_, action) => {
      const arms = action.payload.arms;

      const armMeans = arms.map((arm) => arm.mean);
      const armMax = Math.max(...armMeans);
      const maxArmId = armMeans.indexOf(armMax);

      return {
        ...initialState,
        numArms: action.payload.K,
        budget: action.payload.T,
        arms: action.payload.arms,
        maxArmId: maxArmId,
      };
    },
    move: (state, action) => {
      // make move
      const { armId, decision, reward } = action.payload;

      state.budget -= 1;
      state.totalReward += reward;

      // update arm history
      if (decision === 1) {
        state.arms[armId].history = [...state.arms[armId].history, reward];
      }

      state.lastChoice = {
        armId: armId,
        decision: decision,
        reward: reward,
      };

      state.recommendedArm = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(setup.fulfilled, (state, action) => {
      const { gameId, recommend, game } = action.payload;

      state.recommendedArm = recommend;
      state.systemState = game;
      state.gameId = gameId;
      state.ready = true;
    });
    builder.addCase(record.fulfilled, (state, action) => {
      const { recommend, game } = action.payload;

      state.recommendedArm = recommend;
      state.systemState = game;
    });
    builder.addCase(score.fulfilled, (state, action) => {
      const { armId } = action.payload;

      state.bestArmId = armId;
      state.gameOver = true;
      state.lastChoice = null;
    });
  },
});

export const { init, move } = gameSlice.actions;

export default gameSlice.reducer;
