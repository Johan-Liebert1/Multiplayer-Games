import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { ActionNames } from "./actionNames";
import { UserState } from "./storeTypes";

export interface LoginAction {
  type: ActionNames.USER_LOGIN;
  payload: UserState;
}

export interface SetSocketAction {
  type: ActionNames.SET_SOCKET;
  payload: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export type AllActions = LoginAction | SetSocketAction;
