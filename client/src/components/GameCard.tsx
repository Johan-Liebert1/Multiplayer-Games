import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import { Games } from "../types/games";

import { v4 as uuid } from "uuid";

// material UI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { OutlinedInput, InputLabel, FormControl } from "@material-ui/core";
import { RouteProps } from "../types/routeProps";

interface GameCardProps extends RouteProps {
  gameName: Games;
}

const useStyles = makeStyles({
  root: {
    maxWidth: 225
  },
  actionArea: {
    minWidth: "100%"
  },
  media: {
    height: 225,
    objectFit: "contain"
  }
});

const GameCard: React.FC<GameCardProps> = ({ gameName, history }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const [enterButtonDisabled, setEnterButtonDisabled] = useState<boolean>(true);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const linkStyles = {
    textDecoration: "none"
  };

  let imageUrl: string = `/images/${gameName}.jpg`;

  const newClasses = makeStyles(theme => ({
    root: {
      "& .MuiInputBase-input.MuiOutlinedInput-input": {
        color: "black !important",
        display: "flex"
      },
      "& label.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined":
        {
          color: "black !important"
        },
      "& legend.PrivateNotchedOutline-legend-22": {
        color: "black"
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "black"
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "black"
        },
        "&:hover fieldset": {
          borderColor: "black"
        },
        "&.Mui-focused fieldset": {
          borderColor: "black"
        }
      }
    },
    actionArea: {
      display: "flex"
    }
  }))();

  const enterRoom = () => {
    toggleModal();
    history.push(`${gameName}/${roomId}`);
  };

  useEffect(() => {
    setEnterButtonDisabled(roomId.trim().length === 0);
  }, [roomId]);

  return (
    <>
      <Card className={classes.root} style={{ margin: "1rem 0" }}>
        <CardActionArea className={classes.actionArea}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {gameName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="h4">
              Play {gameName}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link to={`/${gameName}/${uuid()}`} style={linkStyles}>
            <Button size="small" style={{ color: "green" }}>
              Create Room
            </Button>
          </Link>
          <Button size="small" style={{ color: "red" }} onClick={toggleModal}>
            Join Room
          </Button>
        </CardActions>
      </Card>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 0 10px black",
            zIndex: 100
          }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle style={{ color: "black" }}>Enter Room Id</DialogTitle>
          <DialogContent className={newClasses.root}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="room-id">Room Id</InputLabel>
              <OutlinedInput
                id="room-id"
                type="text"
                required
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                labelWidth={70}
                fullWidth
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleModal} style={{ color: "red" }}>
              Cancel
            </Button>
            <Button
              onClick={enterRoom}
              style={{ color: "green", opacity: enterButtonDisabled ? 0.6 : 1 }}
              disabled={enterButtonDisabled}
            >
              Enter Room
            </Button>
          </DialogActions>
        </div>
      )}
    </>
  );
};

export default withRouter(GameCard);
