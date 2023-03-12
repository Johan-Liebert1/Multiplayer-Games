import { Socket } from "socket.io-client";
// import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { ActionNames } from "./actionNames";
import { UserState } from "./storeTypes";

export interface LoginAction {
    type: ActionNames.USER_LOGIN;
    payload: UserState;
}

export interface LogoutAction {
    type: ActionNames.USER_LOGOUT;
}

export interface UpadateUserDetailsAction {
    type: ActionNames.UPDATE_USER_SOCKET_DETAILS;
    payload: UserState;
}

export interface UpdateUserProfilePictureAction {
    type: ActionNames.UPDATE_USER_PROFILE_PICTURE;
    payload: string;
}

export interface SetSocketAction {
    type: ActionNames.SET_SOCKET;
    payload: Socket<any, any>;
}

export type UserActions =
    | LoginAction
    | LogoutAction
    | UpadateUserDetailsAction
    | UpdateUserProfilePictureAction;

export type AllActions = UserActions;
