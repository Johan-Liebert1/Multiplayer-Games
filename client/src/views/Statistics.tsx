import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";

import CircularGraph from "../components/user/CircularGraph";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useEffect } from "react";
import { axiosInstance } from "../config/axiosConfig";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: "rgb(40, 40, 40)"
    },
    inline: {
      display: "inline"
    }
  })
);

const getUserData = async (username: string) => {
  const { data } = await axiosInstance.get(`/games/${username}`);

  console.log(data);
};

const Statistics: React.FC = () => {
  const classes = useStyles();

  const { user } = useTypedSelector(state => state);

  useEffect(() => {
    getUserData(user.username);
  }, []);

  return (
    <List className={classes.root}>
      {new Array(3).fill(0).map(e => (
        <>
          {" "}
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <CircularGraph percentage={100} />
            </ListItemAvatar>
            <ListItemText
              style={{ marginLeft: "1rem" }}
              primary="Games Won"
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="error"
                  >
                    24 out of 400
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  );
};

export default Statistics;
