import { axiosInstance } from "../../config/axiosConfig";
import { ActionNames } from "../../types/store/actionNames";

export const userLoginAction = (userData: object) => async (dispatch: any) => {
  const login = await axiosInstance.post("/user/login", userData);

  if (login.data.success) {
    dispatch({
      type: ActionNames.USER_LOGIN,
      payload: login.data.user
    });
    return true;
  }

  return false;
};
