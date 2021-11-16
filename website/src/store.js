import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import gameSlice from "./slices/gameSlice";
import { logger } from "redux-logger";

export default configureStore({
  reducer: { app: appSlice, game: gameSlice },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), logger],
});
