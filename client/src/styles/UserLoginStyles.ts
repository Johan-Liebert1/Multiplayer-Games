import { makeStyles } from "@material-ui/core";

export default makeStyles(theme => ({
  root: {
    "& label.Mui-focused": {
      color: "white"
    },
    "& label.Mui": {
      color: "white !important"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgb(175, 175, 175)"
      },
      "&:hover fieldset": {
        borderColor: "rgb(200, 200, 200)"
      },
      "&.Mui-focused fieldset": {
        borderColor: "white"
      }
    }
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderColor: "rgba(52, 152, 219,1.0)",
    color: "white",
    borderWidth: "3px",
    "&:hover": {
      backgroundColor: "rgba(52, 152, 219,0.6)",
      borderColor: "#2980b9"
    }
  },
  formGroup: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    marginTop: "1rem"
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: "49%"
  },
  icon: {
    fill: "rgb(200, 200, 200) !important"
  }
}));
