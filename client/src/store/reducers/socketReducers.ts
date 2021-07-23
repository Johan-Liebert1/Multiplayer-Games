import { ActionNames } from "../../types/store/actionNames";
import { AllActions } from "../../types/store/actionTypes";
import { SocketState } from "../../types/store/storeTypes";

export const socketReducer = (
  state: SocketState | null = null,
  action: AllActions
): SocketState | null => {
  switch (action.type) {
    case ActionNames.SET_SOCKET:
      return action.payload;

    default:
      return state;
  }
};
