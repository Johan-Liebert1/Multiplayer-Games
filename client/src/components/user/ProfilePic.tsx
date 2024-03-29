import React from "react";

interface ProfilePicInterface {
    src: string;
    navbar: boolean;
    width?: string;
    height?: string;
    borderRadius?: string;
}

const ProfilePic: React.FC<ProfilePicInterface> = ({
    src,
    navbar,
    width,
    height,
    borderRadius,
}) => {
    const imgSrc = src?.length > 0 ? src : "defaultPic";

    return (
        <img
            src={imgSrc}
            width={width}
            height={height}
            style={{
                objectFit: "cover",
                borderRadius,
            }}
        />
    );
};

ProfilePic.defaultProps = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
};

export default ProfilePic;
