import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  K: 3, // number of arms
  T: 10, // number of interactions/budget
  gameType: "base", // one of base, observe, noObserve
  isSetup: true, // used to determine if on game view or setup view
};

export const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setArms: (state, action) => {
      state.K = action.payload;
    },
    setBudget: (state, action) => {
      state.T = action.payload;
    },
    setGameType: (state, action) => {
      state.gameType = action.payload;
    },
    setSetup: (state, action) => {
      state.isSetup = action.payload;
    },
  },
});

export const { setArms, setBudget, setGameType, setSetup } = appSlice.actions;

export default appSlice.reducer;
