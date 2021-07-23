import React, { useState } from "react";
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
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { InputLabel, OutlinedInput } from "@material-ui/core";
import { RouteProps } from "../types/routeProps";
import { routeNames } from "../routes/router";

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

  const closeModal = () => {
    setModalOpen(!modalOpen);
  };

  const linkStyles = {
    textDecoration: "none"
  };

  let imageUrl: string = `/images/${gameName}.jpg`;

  const newClasses = makeStyles(theme => ({
    root: {
      "& .MuiInputBase-input.MuiOutlinedInput-input": {
        color: "black !important"
      },
      "& label.Mui-focused": {
        color: "black"
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
    }
  }))();

  const enterRoom = () => {
    closeModal();
    history.push(`${gameName}/${roomId}`);
  };

  return (
    <>
      <Card className={classes.root}>
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
            <Typography variant="body2" color="textSecondary" component="p">
              Lizards are a widespread group of squamate reptiles, with over 6,000
              species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link to={`/${gameName}/${uuid()}`} style={linkStyles}>
            <Button size="small" style={{ color: "green" }}>
              Create Room
            </Button>
          </Link>
          <Button size="small" style={{ color: "red" }} onClick={closeModal}>
            Join Room
          </Button>
        </CardActions>
      </Card>

      <Dialog open={modalOpen} onClose={closeModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter Room Id</DialogTitle>
        <DialogContent className={newClasses.root}>
          <OutlinedInput
            id="username"
            type="text"
            required
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            labelWidth={70}
            fullWidth
            autoComplete="username"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} style={{ color: "red" }}>
            Cancel
          </Button>
          <Button onClick={enterRoom} style={{ color: "green" }}>
            Enter Room
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withRouter(GameCard);
