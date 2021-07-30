import React, { useState, useEffect } from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";

import CircularGraph from "../components/user/CircularGraph";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { axiosInstance } from "../config/axiosConfig";
import { ListSubheader } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: "#0B1622",
      borderRadius: "0.25rem",
      boxShadow: "0 0 5px gray"
    },
    inline: {
      display: "inline"
    }
  })
);

type KeyNames = "games_drawn" | "games_lost" | "games_started" | "games_won";

type ApiResponse = {
  [k in KeyNames]: number;
};

interface StatsState {
  chess: ApiResponse;
  checkers: ApiResponse;
}

const getUserData = async (username: string): Promise<StatsState> => {
  const { data } = await axiosInstance.get(`/games/${username}`);

  const object: StatsState = {
    chess: {
      games_won: data.chess_info.games_won,
      games_lost: data.chess_info.games_lost,
      games_drawn: data.chess_info.games_drawn,
      games_started: data.chess_info.games_started
    },
    checkers: {
      games_won: data.checkers_info.games_won,
      games_lost: data.checkers_info.games_lost,
      games_drawn: data.checkers_info.games_drawn,
      games_started: data.checkers_info.games_started
    }
  };

  return object;
};

const Statistics: React.FC = () => {
  const classes = useStyles();

  const { user } = useTypedSelector(state => state);

  const [statistics, setStatistics] = useState<StatsState>({} as StatsState);

  useEffect(() => {
    getUserData(user.username).then(stats => setStatistics(stats));
  }, []);

  const capitalize = (word: string) => {
    return word
      .split("_")
      .map(c => c[0].toUpperCase() + c.slice(1))
      .join(" ");
  };

  const getColor: { [k in KeyNames]: string } = {
    games_won: "#27ae60",
    games_lost: "#e74c3c",
    games_drawn: "#7f8c8d",
    games_started: "#16a085"
  };

  return (
    <div
      style={{
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around"
      }}
    >
      {Object.entries(statistics).map(
        ([gameName, gameStatsObject]: [string, ApiResponse]) => (
          <List
            className={classes.root}
            key={gameName}
            subheader={
              <ListSubheader
                component="h1"
                style={{ color: "inherit", fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {capitalize(gameName)}
              </ListSubheader>
            }
          >
            {Object.entries(gameStatsObject).map(([key, value]: [string, number]) => (
              <>
                <ListItem alignItems="flex-start" key={key}>
                  <ListItemAvatar>
                    <CircularGraph
                      percentage={
                        gameStatsObject.games_started === 0
                          ? 0
                          : (value / gameStatsObject.games_started) * 100
                      }
                      color={getColor[key as KeyNames]}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    style={{ marginLeft: "1rem" }}
                    primary={capitalize(key)}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          style={{ color: getColor[key as KeyNames] }}
                        >
                          {value} out of {gameStatsObject.games_started}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </List>
        )
      )}
    </div>
  );
};

export default Statistics;
