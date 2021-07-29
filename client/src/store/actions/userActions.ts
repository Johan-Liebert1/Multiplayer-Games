import { axiosInstance } from "../../config/axiosConfig";
import { ActionNames } from "../../types/store/actionNames";
import { UserState } from "../../types/store/storeTypes";

export const userLoginAction = (userData: object) => async (dispatch: any) => {
  const login = await axiosInstance.post("/user/login", userData);

  if (login.data.success) {
    dispatch({
      type: ActionNames.USER_LOGIN,
      payload: login.data.user
    });
  }
};

export const updateUserSocketDetails = (userData: UserState) => (dispatch: any) => {
  console.log({ userData });
  dispatch({
    type: ActionNames.UPDATE_USER_SOCKET_DETAILS,
    payload: userData
  });
};

export const updateProfilePicAction = (profilePictureUrl: string) => (dispatch: any) => {
  dispatch({
    type: ActionNames.UPDATE_USER_PROFILE_PICTURE,
    payload: profilePictureUrl
  });
};
