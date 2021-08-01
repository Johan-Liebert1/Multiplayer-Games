import React, { useRef } from "react";
import { CELL_SIZE, Games } from "../../types/games";
import { motion, PanInfo } from "framer-motion";
import { ChessPieceColor } from "../../types/chessTypes";
import { CheckersPieceColor } from "../../types/checkersTypes";

interface CellProps {
  game: Games;
  image: string;
  row: number;
  col: number;
  color: string;
  isClicked?: boolean;
  blueDot: boolean;
  testBoard?: boolean;
  redDot?: boolean;
  boardRef?: React.MutableRefObject<HTMLDivElement | null>;
  userChessColor?: ChessPieceColor;
  userCheckersColor?: CheckersPieceColor;
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
  boardRef,
  userChessColor,
  userCheckersColor,
  testBoard,
  showMoves
}) => {
  const cellRef = useRef<HTMLDivElement | null>(null);

  const bgColor = isClicked ? "rgba(240, 147, 43, 0.5)" : null;
  const imgDim = game === "chess" ? 65 : 40;

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
    width: imgDim,
    zIndex: 500
  };

  const dotStyle: React.CSSProperties = {
    borderRadius: "50%",
    border: `3px solid ${blueDot && "rgb(41, 128, 185)"}`,
    backgroundColor: `${blueDot && "rgb(41, 128, 185)"}`,
    height: 20,
    width: 20,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };

  const handleCellClick = () => {
    showMoves(row, col);
  };

  const dragEnded = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const { clientX: x, clientY: y } = event as MouseEvent;

    if (boardRef?.current) {
      const boardRect = boardRef.current.getBoundingClientRect();

      const row1 = Math.floor(Math.abs(boardRect.top - y) / CELL_SIZE);
      const col1 = Math.floor(Math.abs(boardRect.left - x) / CELL_SIZE);

      if (testBoard) {
        showMoves(row1, col1);
        return;
      }

      if (userChessColor) {
        switch (userChessColor) {
          case "white":
            showMoves(row1, col1);
            break;

          case "black":
            showMoves(Math.abs(7 - row1), col1);
            break;
        }
      } else if (userCheckersColor) {
        switch (userCheckersColor) {
          case "red":
            showMoves(row1, col1);
            break;

          case "white":
            showMoves(Math.abs(7 - row1), col1);
            break;
        }
      }
    }
  };

  return (
    <div onMouseDown={handleCellClick} style={divStyles} ref={cellRef}>
      <div style={innerDivStyles}>
        {(blueDot || redDot) && <div style={dotStyle}></div>}
        {image && (
          <motion.img
            src={window.location.origin + "/" + image}
            style={imgStyle}
            alt={image}
            whileHover={{ cursor: "grab" }}
            drag
            dragConstraints={cellRef}
            dragElastic={1}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
            onDragEnd={event => dragEnded(event)}
          />
        )}
      </div>
    </div>
  );
};

Cell.defaultProps = {
  testBoard: false
};

export default Cell;
