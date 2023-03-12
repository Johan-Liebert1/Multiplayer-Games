import { makeStyles } from "@material-ui/core";
import React from "react";

export const wrapperDivStyles: React.CSSProperties = {
    width: "95%",
    minHeight: "92vh",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
};

export const boardStyles: React.CSSProperties = {
    width: "65%",
    display: "flex",
    justifyContent: "center",
};

export const chatStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
};

export const roomIdInputStyles = makeStyles((theme) => ({
    root: {
        "& .MuiInputBase-root.MuiFilledInput-root.MuiInputBase-fullWidth": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },

        "& label.MuiInputLabel-formControl": {
            top: 5,
            left: 15,
        },
    },
}));

export const chatBoxStyles = makeStyles((theme) => ({
    root: {
        height: "475px",
        marginTop: "1rem",
    },
    messagesContainer: {
        height: "90%",
        maxHeight: "90%",
        backgroundColor: "#222f3e",
        overflow: "auto",
    },
    inputContainer: {
        "& .MuiFilledInput-underline:after": {
            borderBottomColor: "white",
        },
        "& .MuiFilledInput-root ": {
            borderTop: "2px solid white",
            backgroundColor: "#222f3e",
            color: "white",
        },
        "& .MuiInputBase-root.MuiFilledInput-root.MuiInputBase-formControl": {
            borderRadius: 0,
        },
    },
}));
