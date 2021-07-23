import { FilledInput, FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import React from "react";
import { chatBoxStyles } from "../styles/gameScreenStyles";

const Chat: React.FC = () => {
  const classes = chatBoxStyles();

  return (
    <div className={classes.root}>
      <div className={classes.messagesContainer}></div>
      <div className={classes.inputContainer}>
        <FormControl style={{ width: "100%" }} variant="filled">
          <InputLabel htmlFor="standard-read-only-input">Type you message</InputLabel>
          <FilledInput id="standard-read-only-input" fullWidth />
        </FormControl>
      </div>
    </div>
  );
};

export default Chat;
