import { getStr } from "../../helpers/globalHelpers";
import {
  CheckersBoardType,
  CheckersMoveType,
  CheckersPieceColor
} from "../../types/checkersTypes";

export default class CheckersPiece {
  color: CheckersPieceColor;
  row: number;
  col: number;
  isKing: boolean;
  oppColor: CheckersPieceColor;
  currentRow: number;
  currentCol: number;
  moves: CheckersMoveType;

  constructor(color: CheckersPieceColor, pos: number[]) {
    this.color = color;
    this.isKing = false;
    this.row = pos[0];
    this.col = pos[1];
    this.oppColor = this.color === "red" ? "white" : "red";
    this.currentRow = pos[0];
    this.currentCol = pos[1];
    this.moves = {};
  }

  makeKing = () => (this.isKing = true);

  setRowCol = (row: number, col: number) => {
    this.currentRow = row;
    this.currentCol = col;

    if (this.row < 2) {
      if (this.currentRow === 7) {
        this.makeKing();
      }
    } else {
      if (this.currentRow === 0) {
        this.makeKing();
      }
    }
  };

  getCaptuingMoves = (board: CheckersBoardType): void => {
    let rowAdders: number[];
    const colAdders: number[] = [2, -2];

    // indices where we'll check if a piece of opposite color exists or not
    let rowCheck: number[];
    const colCheck: number[] = [1, -1];

    if (this.row < 2) {
      // row can only increase
      rowAdders = [2];
      rowCheck = [1];
    } else {
      // row can only decrease
      rowAdders = [-2];
      rowCheck = [-1];
    }

    if (this.isKing) {
      // row can increase and decrease
      rowAdders = [2, -2];
      rowCheck = [1, -1];
    }

    rowAdders.forEach((ra, raIdx) => {
      if (this.currentRow + ra >= 0 && this.currentRow + ra < board.length) {
        colAdders.forEach((ca, caIdx) => {
          if (this.currentCol + ca >= 0 && this.currentCol + ca < board[0].length) {
            // we're within bounds

            // the potential move
            const pRow = this.currentRow + ra;
            const pCol = this.currentCol + ca;

            // potential move square needs to be empty
            if (board[pRow][pCol] === 0) {
              // gotta check if a piece exists at this position
              const rCheck = this.currentRow + rowCheck[raIdx];
              const cCheck = this.currentCol + colCheck[caIdx];
              const piece = board[rCheck][cCheck];

              if (piece instanceof CheckersPiece) {
                // piece exists, now we check if it's color is the opposite color or not
                if (piece.color === this.oppColor) {
                  // can capture the piece
                  this.moves[getStr(pRow, pCol)] = {
                    capturing: {
                      row: rCheck,
                      col: cCheck
                    }
                  };
                }
              }
            }
          }
        });
      }
    });
  };

  validMoves = (board: CheckersBoardType) => {
    this.moves = {};

    let rowAdders: number[];
    let colAdders: number[] = [1, -1];

    if (this.row < 2) {
      // row can only increase
      rowAdders = [1];
    } else {
      // row can only decrease
      rowAdders = [-1];
    }

    if (this.isKing) {
      // row can increase and decrease
      rowAdders = [1, -1];
    }

    for (let r = 0; r < rowAdders.length; r++) {
      const ra = rowAdders[r];

      if (this.currentRow + ra >= 0 && this.currentRow + ra < board.length) {
        for (let c = 0; c < colAdders.length; c++) {
          const ca = colAdders[c];

          if (this.currentCol + ca >= 0 && this.currentCol + ca < board[0].length) {
            // the space on board needs to be empty
            const pRow = this.currentRow + ra;
            const pCol = this.currentCol + ca;

            if (board[pRow][pCol] === 0) {
              this.moves[getStr(pRow, pCol)] = "valid";
            }
          }
        }
      }
    }

    this.getCaptuingMoves(board);

    return this.moves;
  };
}
