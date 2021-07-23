import { makeStyles } from "@material-ui/core";
import React from "react";

export const wrapperDivStyles: React.CSSProperties = {
  width: "90%",
  height: "100%",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  flexWrap: "wrap"
};

export const boardStyles: React.CSSProperties = {
  width: "70%",
  display: "flex",
  justifyContent: "center"
};

export const chatStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  height: "100%"
};

export const roomIdInputStyles = makeStyles(theme => ({
  root: {
    "& label.MuiInputLabel-formControl": {
      top: 5,
      left: 15
    }
  }
}));

export const chatBoxStyles = makeStyles(theme => ({
  root: {
    height: "475px",
    marginTop: "1rem"
  },
  messagesContainer: {
    height: "90%",
    backgroundColor: "#222f3e"
  },
  inputContainer: {
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "white"
    },
    "& .MuiFilledInput-root ": {
      borderTop: "2px solid white",
      backgroundColor: "#222f3e",
      color: "white"
    },
    "& .MuiInputBase-root.MuiFilledInput-root.MuiInputBase-formControl": {
      borderRadius: 0
    }
  }
}));
