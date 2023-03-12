import React from "react";
import UserDetails, { UserInformation } from "../components/user/UserDetails";
import { axiosInstance } from "../config/axiosConfig";
import { useTypedSelector } from "../hooks/useTypedSelector";

const UserProfileScreen: React.FC = () => {
    const { user } = useTypedSelector((state) => state);

    const editUserInfo = async (formDetails: UserInformation) => {
        const createRequest = await axiosInstance.put(
            "/user/editdetails",
            formDetails,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
        console.log(createRequest);
    };

    return (
        <div style={{ height: "92vh", display: "flex", alignItems: "center" }}>
            <UserDetails
                isForRegister={false}
                userInfo={{ ...user, password: "", confirmPassword: "" }}
                submitHandler={editUserInfo}
            />
        </div>
    );
};

export default UserProfileScreen;
