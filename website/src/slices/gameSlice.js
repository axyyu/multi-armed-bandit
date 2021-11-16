import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Prob from "prob.js";
import API from "../utils/api";

const initialState = {
  ready: false,
  numArms: 0, // number of arms
  budget: 0, // number of remaining interactions
  totalReward: 0, // total reward amount
  lastChoice: null, // last decision made
  systemState: null, // serialized system state
  arms: [], // state of individual arms,
  recommendedArm: null, // if arm is recommended
};

export const setup = createAsyncThunk("setup", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const { K, T, gameType } = state.app;

  thunkAPI.dispatch(init({ K, T }));

  if (gameType === "base") return;

  const res = await API.setup(gameType, K, T);
  return res;
});

export const record = createAsyncThunk("record", async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const { gameType } = state.app;
  const { arms, systemState } = state.game;
  const { armId, decision } = payload;

  // Calculate reward
  const { mean, stdDev } = arms[armId];
  const G = Prob.normal(mean, stdDev);
  const reward = decision === 1 ? G() : 0;

  // Update state
  thunkAPI.dispatch(move({ armId, decision, reward }));

  if (gameType === "base") return;

  const res = await API.record(gameType, systemState, armId, reward, decision);
  return res;
});

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    init: (_, action) => {
      // initializes game state and generates arms
      const U = Prob.uniform(0, 1);

      const arms = [];
      for (let i = 0; i < action.payload.K; i++) {
        arms.push({
          mean: U(),
          stdDev: U(),
          history: [],
        });
      }

      return {
        ...initialState,
        numArms: action.payload.K,
        budget: action.payload.T,
        arms: arms,
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
      if (action.payload) {
        const { recommend, game } = action.payload;

        state.recommendedArm = recommend;
        state.systemState = game;
      }
      state.ready = true;
    });
    builder.addCase(record.fulfilled, (state, action) => {
      if (action.payload) {
        const { recommend, game } = action.payload;

        state.recommendedArm = recommend;
        state.systemState = game;
      }
    });
  },
});

export const { init, move } = gameSlice.actions;

export default gameSlice.reducer;
