import { ActionNames } from "../../types/store/actionNames";
import { LoginAction, UpadateUserDetailsAction } from "../../types/store/actionTypes";
import { UserState } from "../../types/store/storeTypes";

const initialState: UserState = {
  username: "",
  token: "",
  firstName: "",
  lastName: "",
  email: "",
  id: -1,
  profilePictureUrl: ""
};

export const userReducer = (
  state: UserState = initialState,
  action: LoginAction | UpadateUserDetailsAction
): UserState => {
  switch (action.type) {
    case ActionNames.USER_LOGIN:
      // log the user in
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;

    case ActionNames.UPDATE_USER_SOCKET_DETAILS:
      return action.payload;

    default:
      return state;
  }
};
