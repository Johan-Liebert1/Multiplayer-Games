import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EditIcon from "@material-ui/icons/Edit";

import useStyles from "../../styles/UserLoginStyles";
import { FormControl, FormHelperText, IconButton, makeStyles } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import ProfilePic from "./ProfilePic";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { axiosInstance } from "../../config/axiosConfig";
import { useDispatch } from "react-redux";
import { updateProfilePicAction } from "../../store/actions/userActions";

export type UserInformation = {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
};

interface UserDetailsProps {
  isForRegister: boolean;
  submitHandler: (userInfo: UserInformation) => Promise<void>;
  userInfo?: UserInformation;
}

const useMoreStyles = makeStyles(() => ({
  editIconContainer: {
    padding: "1rem",
    position: "relative"
  },

  editIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    "&:hover": {
      fill: "white",
      cursor: "pointer"
    }
  }
}));

const UserDetails: React.FC<UserDetailsProps> = ({
  isForRegister,
  userInfo,
  submitHandler
}) => {
  const classes = useStyles();
  const moreClasses = useMoreStyles();

  const dispatch = useDispatch();

  const { user } = useTypedSelector(state => state);

  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });
  const [wasUsernameChanged, setWasUsernameChanged] = useState(false);

  const [formDetails, setFormDetails] = useState<UserInformation>({
    username: userInfo?.username || "",
    password: userInfo?.password || "",
    confirmPassword: userInfo?.confirmPassword || "",
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    profilePictureUrl: userInfo?.profilePictureUrl || ""
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setPasswordsMatch(formDetails.password === formDetails.confirmPassword);
  }, [formDetails.confirmPassword, formDetails.password]);

  const handleChange = (key: string, value: string) => {
    if (key === "username") {
      setWasUsernameChanged(true);
    }

    setFormDetails({
      ...formDetails,
      [key]: value
    });
  };

  const areFormDetailsValid = (): boolean => {
    if (!passwordsMatch) return false;
    if (formDetails.username.trim().length === 0) return false;

    return true;
  };

  const registerUser = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (areFormDetailsValid()) {
      submitHandler(formDetails);
    } else {
      console.log("nooooooooo");
    }
  };

  const openFileUploader = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.onchange = async (e: Event) => {
      e.preventDefault();

      if (!e || !e.target) return;

      let selectedFile = (e.target as HTMLInputElement).files;

      if (!selectedFile) return;

      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      formData.append("myFile", selectedFile[0], selectedFile[0].name);

      // Details of the uploaded file
      console.log(selectedFile);

      // for (let i of formData.entries()) {
      //   console.log(i);
      // }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "content-type": "multipart/formdata"
        }
      };

      try {
        // Request made to the backend api
        // Send formData object
        const response = await axiosInstance.post(
          `/upload/profile-picture`,
          formData,
          config
        );

        if (response.data.success) {
          console.log(response.data);
          dispatch(updateProfilePicAction(response.data.profilePictureUrl));
          // toastrSuccess("Profile Picture Changed", response.data.message);
        } else {
          // toastrError("Error", response.data.message);
        }
      } catch (err) {
        // toastrError("Error", err);
      }
    };
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className={classes.root}
      style={{ minWidth: "70%" }}
    >
      {/* <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
      </Alert> */}
      <CssBaseline />
      <div className={classes.paper}>
        {!userInfo ? (
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
        ) : (
          <div className={moreClasses.editIconContainer}>
            <EditIcon onClick={openFileUploader} className={moreClasses.editIcon} />
            {userInfo.profilePictureUrl.length ? (
              <ProfilePic
                src={userInfo.profilePictureUrl}
                navbar={false}
                width="125"
                height="125"
              />
            ) : (
              <AccountCircleIcon style={{ width: "125", height: "125" }} />
            )}
          </div>
        )}
        <Typography component="h1" variant="h5">
          {isForRegister ? "Sign Up" : "Profile"}
        </Typography>
        <form className={classes.form}>
          <div className={classes.formGroup}>
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="username">Username</InputLabel>
              <OutlinedInput
                id="username"
                type="text"
                required
                value={formDetails.username}
                onChange={e => handleChange("username", e.target.value)}
                labelWidth={70}
                fullWidth
                autoComplete="username"
              />
              {wasUsernameChanged && formDetails.username.trim().length === 0 && (
                <FormHelperText error>Username cannot be empy</FormHelperText>
              )}
            </FormControl>

            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                type="text"
                required
                value={formDetails.email}
                onChange={e => handleChange("email", e.target.value)}
                labelWidth={70}
                fullWidth
                autoComplete="email"
              />
            </FormControl>
          </div>

          <div className={classes.formGroup}>
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                required
                type={showPassword.password ? "text" : "password"}
                value={formDetails.password}
                onChange={e => handleChange("password", e.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          password: !showPassword.password
                        })
                      }
                      edge="end"
                    >
                      {showPassword.password ? (
                        <Visibility className={classes.icon} />
                      ) : (
                        <VisibilityOff className={classes.icon} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
              {!passwordsMatch && (
                <FormHelperText error>Passwords do not match</FormHelperText>
              )}
            </FormControl>

            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-confirm-password">
                Confirm New Password
              </InputLabel>
              <OutlinedInput
                required
                id="outlined-adornment-confirm-password"
                type={showPassword.confirm ? "text" : "password"}
                value={formDetails.confirmPassword}
                onChange={e => handleChange("confirmPassword", e.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirm: !showPassword.confirm
                        })
                      }
                      edge="end"
                    >
                      {showPassword.confirm ? (
                        <Visibility className={classes.icon} />
                      ) : (
                        <VisibilityOff className={classes.icon} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
              {!passwordsMatch && (
                <FormHelperText error>Passwords do not match</FormHelperText>
              )}
            </FormControl>
          </div>

          <div className={classes.formGroup}>
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-first-name">First Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-first-name"
                type="text"
                value={formDetails.firstName}
                onChange={e => handleChange("firstName", e.target.value)}
                labelWidth={70}
              />
            </FormControl>

            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-last-name">Last Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-last-name"
                type="text"
                value={formDetails.lastName}
                onChange={e => handleChange("lastName", e.target.value)}
                labelWidth={70}
              />
            </FormControl>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="default"
              className={classes.submit}
              onClick={e => registerUser(e)}
            >
              {isForRegister ? "Register" : "Submit Edit"}
            </Button>
          </div>
        </form>
      </div>

      {isForRegister && (
        <div>
          Already have an account?{" "}
          <Link to="/">
            <Button color="primary" variant="contained">
              Login
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default UserDetails;
