import { ActionNames } from "../../types/store/actionNames";
import { AllActions } from "../../types/store/actionTypes";
import { UserState } from "../../types/store/storeTypes";

const initialState: UserState = {
  username: "",
  token: "",
  firstName: "",
  lastName: "",
  email: "",
  id: -1
};

export const userReducer = (
  state: UserState = initialState,
  action: AllActions
): UserState => {
  switch (action.type) {
    case ActionNames.USER_LOGIN:
      // log the user in
      return action.payload;

    default:
      return state;
  }
};
