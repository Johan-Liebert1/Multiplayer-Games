import React from "react";
import UserDetails from "../components/user/UserDetails";

import { axiosInstance } from "../config/axiosConfig";
import { RouteProps } from "../types/routeProps";

interface UserRegisterProps extends RouteProps {}

const UserRegister: React.FC<UserRegisterProps> = () => {
  const registerUser = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    // if (areFormDetailsValid()) {
    //   const createRequest = await axiosInstance.post("/user/register", formDetails);
    //   console.log(createRequest);
    // } else {
    //   console.log("nooooooooo");
    // }
  };

  return (
    <div style={{ height: "92vh", display: "flex", alignItems: "center" }}>
      <UserDetails isForRegister />
    </div>
  );
};

export default UserRegister;
