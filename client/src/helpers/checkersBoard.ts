import CheckersPiece from "../classes/checkers/CheckersPiece";
import { CheckersBoardType } from "../types/checkersTypes";

export const getNewCheckersBoard = (): CheckersBoardType => {
  const tempBoard = new Array(8).fill(0).map(e => new Array(8).fill(0));

  for (let row = 0; row < tempBoard.length; row++) {
    for (let col = 0; col < tempBoard.length; col++) {
      if (row < 2) {
        if (row === 0 && col % 2 === 0) {
          tempBoard[row][col] = new CheckersPiece("white", [row, col]);
        } else if (row === 1 && col % 2 !== 0) {
          tempBoard[row][col] = new CheckersPiece("white", [row, col]);
        }
      }

      if (row > 5) {
        if (row === 6 && col % 2 === 0) {
          tempBoard[row][col] = new CheckersPiece("red", [row, col]);
        } else if (row === 7 && col % 2 !== 0) {
          tempBoard[row][col] = new CheckersPiece("red", [row, col]);
        }
      }
    }
  }

  return tempBoard;
};
