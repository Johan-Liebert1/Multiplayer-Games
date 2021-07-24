import { applyMiddleware, createStore } from "redux";
import combinedReducers from "./reducers/combinedReducers";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { UserState } from "../types/store/storeTypes";
import { getFromLocalStorage } from "../helpers/storeHelpers";

const initialUserState = getFromLocalStorage<UserState>("user");

const initialState = {
  user: initialUserState,
  socket: null
};

const store = createStore(
  combinedReducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
