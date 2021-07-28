import React from "react";
import UserDetails, { UserInformation } from "../components/user/UserDetails";

import { axiosInstance } from "../config/axiosConfig";
import { RouteProps } from "../types/routeProps";

interface UserRegisterProps extends RouteProps {}

const UserRegister: React.FC<UserRegisterProps> = () => {
  const registerUser = async (formDetails: UserInformation) => {
    const createRequest = await axiosInstance.post("/user/register", formDetails);
    console.log(createRequest);
  };

  return (
    <div style={{ height: "92vh", display: "flex", alignItems: "center" }}>
      <UserDetails isForRegister submitHandler={registerUser} />
    </div>
  );
};

export default UserRegister;
