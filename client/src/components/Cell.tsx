import React from "react";
import { CELL_SIZE, Games } from "../types/games";

interface CellProps {
  game: Games;
  image: string;
  row: number;
  col: number;
  color: string;
  isClicked?: boolean;
  blueDot: boolean;
  redDot?: boolean;
  showMoves: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({
  game,
  image,
  row,
  col,
  color,
  isClicked,
  blueDot,
  redDot,
  showMoves
}) => {
  const bgColor = isClicked ? "rgba(240, 147, 43, 0.5)" : null;
  const imgDim = game === "chess" ? 70 : 50;

  const divStyles: React.CSSProperties = {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: color,
    padding: 0,
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  };

  const innerDivStyles: React.CSSProperties = {
    backgroundColor: bgColor ? bgColor : "transparent",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    boxShadow: redDot ? "inset 0px 0px 20px 5px rgb(255, 0, 0)" : ""
  };

  const imgStyle: React.CSSProperties = {
    height: imgDim,
    width: imgDim
  };

  const dotStyle: React.CSSProperties = {
    borderRadius: "50%",
    border: `3px solid ${blueDot && "rgb(41, 128, 185)"}`,
    backgroundColor: `${blueDot && "rgb(41, 128, 185)"}`,
    height: 20,
    width: 20,
    position: "absolute",
    top: 27.5,
    left: 27.5
  };

  const handleCellClick = () => {
    showMoves(row, col);
  };

  return (
    <div onClick={handleCellClick} style={divStyles}>
      <div style={innerDivStyles}>
        {(blueDot || redDot) && <div style={dotStyle}></div>}
        {image && (
          <img
            src={window.location.origin + "/" + image}
            style={imgStyle}
            alt={image}
            draggable
          />
        )}
      </div>
    </div>
  );
};

export default Cell;
