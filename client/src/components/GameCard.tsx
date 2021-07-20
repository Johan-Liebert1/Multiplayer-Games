import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Games } from "../types/games";

interface GameCardProps {
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

const GameCard: React.FC<GameCardProps> = ({ gameName }) => {
  const classes = useStyles();

  let imageUrl: string = `/images/${gameName}.jpg`;

  return (
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
            Lizards are a widespread group of squamate reptiles, with over 6,000 species,
            ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" style={{ color: "green" }}>
          Create Room
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameCard;
