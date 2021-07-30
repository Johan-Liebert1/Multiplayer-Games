import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

interface CircularGraphProps {
  percentage: number;
}

const CircularGraph: React.FC<CircularGraphProps> = ({ percentage }) => {
  return (
    <div>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          size="3rem"
          variant="determinate"
          value={percentage}
          color="secondary"
        />
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
