import React from "react";
import UserDetails, { UserInformation } from "../components/user/UserDetails";

import { axiosInstance } from "../config/axiosConfig";
import showToast from "../store/toasts";
import { RouteProps } from "../types/routeProps";

interface UserRegisterProps extends RouteProps {}

const UserRegister: React.FC<UserRegisterProps> = () => {
  const registerUser = async (formDetails: UserInformation) => {
    try {
      const createRequest = await axiosInstance.post("/user/register", formDetails);

      if (createRequest.data.success) {
        showToast("success", {
          header: "Registration Successful",
          message: `User with username ${formDetails.username} registered successfully`
        });
      } else {
        showToast("warning", { message: createRequest.data.message });
      }
    } catch (e) {
      showToast("error", { message: e.error.message });
    }
  };

  return (
    <div style={{ height: "92vh", display: "flex", alignItems: "center" }}>
      <UserDetails isForRegister submitHandler={registerUser} />
    </div>
  );
};

export default UserRegister;
