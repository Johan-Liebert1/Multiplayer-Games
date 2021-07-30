import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";

interface CircularGraphProps {
  percentage: number;
  color: string;
}

const CircularGraph: React.FC<CircularGraphProps> = ({ percentage, color }) => {
  const classes = makeStyles(t => ({
    circle: {
      "& svg circle": {
        stroke: percentage !== 0 ? color : "white"
      }
    }
  }))();

  return (
    <div>
      <Box position="relative" display="inline-flex" className={classes.circle}>
        <CircularProgress size="3rem" variant="determinate" value={percentage || 100} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            color="initial"
          >{`${percentage.toFixed(0)}%`}</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default CircularGraph;
