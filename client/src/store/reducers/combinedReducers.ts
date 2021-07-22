import { combineReducers } from "redux";
import { userReducer } from "./userReducer";

const combinedReducers = combineReducers({
  user: userReducer
});

export type RootState = ReturnType<typeof combinedReducers>;

export default combinedReducers;
