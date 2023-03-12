import { combineReducers } from "redux";
import { socketReducer } from "./socketReducers";
import { userReducer } from "./userReducer";

const combinedReducers = combineReducers({
    user: userReducer,
    socket: socketReducer,
});

export type RootState = ReturnType<typeof combinedReducers>;

export default combinedReducers;
