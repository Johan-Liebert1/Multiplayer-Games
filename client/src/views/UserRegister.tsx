import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import useStyles from "../styles/UserLoginStyles";
import { FormControl, FormHelperText, IconButton } from "@material-ui/core";
// import { Alert, AlertTitle } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import clsx from "clsx";
import { axiosInstance } from "../config/axiosConfig";
import { RouteProps } from "../types/routeProps";

interface UserRegisterProps extends RouteProps {}

const UserRegister: React.FC<UserRegisterProps> = () => {
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });

  const [formDetails, setFormDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: ""
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setPasswordsMatch(formDetails.password === formDetails.confirmPassword);
  }, [formDetails.confirmPassword, formDetails.password]);

  const handleChange = (key: string, value: string) => {
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
      const createRequest = await axiosInstance.post("/user/register", formDetails);
      console.log(createRequest);
    } else {
      console.log("nooooooooo");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className={classes.root}
      style={{ minWidth: "50%" }}
    >
      {/* <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
      </Alert> */}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form}>
          <div>
            <FormControl style={{ width: "100%" }} variant="outlined">
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
              {formDetails.username.trim().length === 0 && (
                <FormHelperText error>Username cannot be empy</FormHelperText>
              )}
            </FormControl>
          </div>

          <div className={classes.formGroup}>
            <FormControl className={clsx(classes.textField)} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password*</InputLabel>
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

            <FormControl className={clsx(classes.textField)} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-confirm-password">
                Confirm Password*
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
            <FormControl className={clsx(classes.textField)} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-first-name">First Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-first-name"
                type="text"
                value={formDetails.firstName}
                onChange={e => handleChange("firstName", e.target.value)}
                labelWidth={70}
              />
            </FormControl>

            <FormControl className={clsx(classes.textField)} variant="outlined">
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

          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="default"
            className={classes.submit}
            onClick={e => registerUser(e)}
          >
            Register
          </Button>
        </form>
      </div>

      <div>
        Already have an account?{" "}
        <Link to="/">
          <Button color="primary" variant="contained">
            Login
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default UserRegister;
