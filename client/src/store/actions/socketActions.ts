import { ActionNames } from "../../types/store/actionNames";
import { SocketState } from "../../types/store/storeTypes";

export const setSocketAction = (socket: SocketState) => (dispatch: any) => {
  dispatch({
    type: ActionNames.SET_SOCKET,
    payload: socket
  });
};
