import React from "react";
import UserDetails from "../components/user/UserDetails";
import { useTypedSelector } from "../hooks/useTypedSelector";

const UserProfileScreen: React.FC = () => {
  const { user } = useTypedSelector(state => state);

  return (
    <div style={{ height: "92vh", display: "flex", alignItems: "center" }}>
      <UserDetails
        isForRegister={false}
        userInfo={{ ...user, password: "", confirmPassword: "" }}
      />
    </div>
  );
};

export default UserProfileScreen;
