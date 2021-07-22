import { ActionNames } from "../../types/actionNames";
import { AllActions } from "../../types/actionTypes";
import { UserState } from "../../types/storeTypes";

const initialState: UserState = {
  username: "",
  token: "",
  firstName: "",
  lastName: "",
  email: ""
};

export const userReducer = (state: UserState = initialState, action: AllActions) => {
  switch (action.type) {
    case ActionNames.USER_LOGIN:
      // log the user in
      return state;

    default:
      return state;
  }
};
