import React, { useState } from "react";
import { Link } from "react-router-dom";

import OutlinedInput from "@material-ui/core/OutlinedInput";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { FormControl, FormHelperText, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import useStyles from "../styles/UserLoginStyles";

const UserLogin: React.FC = () => {
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const [formDetails, setFormDetails] = useState({
    username: "",
    password: ""
  });

  const handleChange = (key: string, value: string) => {
    setFormDetails({
      ...formDetails,
      [key]: value
    });
  };

  const loginUser = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
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

          <div style={{ marginTop: "1rem" }}>
            <FormControl style={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password*</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                required
                type={showPassword ? "text" : "password"}
                value={formDetails.password}
                onChange={e => handleChange("password", e.target.value)}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <Visibility className={classes.icon} />
                      ) : (
                        <VisibilityOff className={classes.icon} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
              {formDetails.password.trim().length === 0 && (
                <FormHelperText error>Password is required</FormHelperText>
              )}
            </FormControl>
          </div>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="default"
            className={classes.submit}
            onClick={e => loginUser(e)}
          >
            Sign In
          </Button>
        </form>
      </div>
      <div>
        Don't have an account?{" "}
        <Link to="/register">
          <Button color="primary" variant="contained">
            Register
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default UserLogin;
