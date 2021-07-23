import { applyMiddleware, createStore } from "redux";
import combinedReducers from "./reducers/combinedReducers";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { UserState } from "../types/store/storeTypes";

const store = createStore(
  combinedReducers,
  { user: {} as UserState },
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
