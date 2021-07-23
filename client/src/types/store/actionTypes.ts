import { ActionNames } from "./actionNames";
import { UserState } from "./storeTypes";

export interface LoginAction {
  type: ActionNames.USER_LOGIN;
  payload: UserState;
}

export type AllActions = LoginAction;
