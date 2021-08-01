import {
  ChessBoardType,
  ChessPieceColor,
  KingParametersType,
  PotentialCapturingMove
} from "../../types/chessTypes";
import ChessPiece from "./ChessPiece";

import { getStr } from "../../helpers/globalHelpers";

class Pawn extends ChessPiece {
  hasMoved: boolean;
  potentialCapturingMoves: PotentialCapturingMove;

  constructor(color: ChessPieceColor, row: number, col: number) {
    super(color, row, col);
    this.hasMoved = false;
    this.pieceName = "pawn";
    this.image = `images/chess/${this.color}Pawn.png`;

    this.potentialCapturingMoves = {};
    this.setHasMoved();
  }

  setHasMoved = () => {
    if (this.color === "black" && this.row !== 1) {
      this.hasMoved = true;
    }

    if (this.color === "white" && this.row !== 6) {
      this.hasMoved = true;
    }
  };

  validMoves = (
    board: ChessBoardType,
    kingParameters: KingParametersType,
    initialCall = false
  ) => {
    // console.log(kingParameters);

    this.resetMoves();

    const adder = this.color === "black" ? 1 : -1;

    if (!this.hasMoved && board[this.row + adder][this.col] === 0) {
      if (board[this.row + adder * 2][this.col] === 0) {
        this.moves[getStr(this.row + adder * 2, this.col)] = "valid";
      }
    }

    if (this.row + adder >= 0 && this.row + adder < 8) {
      if (board[this.row + adder][this.col] === 0) {
        this.moves[getStr(this.row + adder, this.col)] = "valid";
      }

      // capturing moves
      if (this.col + 1 < 8) {
        const potentialCapture = board[this.row + adder][this.col + 1];
        if (potentialCapture instanceof ChessPiece) {
          if (potentialCapture.color !== this.color) {
            this.moves[getStr(this.row + adder, this.col + 1)] = "capturing";
          } else {
            this.protectingMoves[getStr(this.row + adder, this.col + 1)] = "protecting";
          }
        } else if (potentialCapture === 0) {
          this.potentialCapturingMoves[getStr(this.row + adder, this.col + 1)] =
            "potentialCapture";
        }
      }
      if (this.col - 1 >= 0) {
        const potentialCapture = board[this.row + adder][this.col - 1];

        if (potentialCapture instanceof ChessPiece) {
          if (potentialCapture.color !== this.color) {
            this.moves[getStr(this.row + adder, this.col - 1)] = "capturing";
          } else {
            this.protectingMoves[getStr(this.row + adder, this.col - 1)] = "protecting";
          }
        } else if (potentialCapture === 0) {
          this.potentialCapturingMoves[getStr(this.row + adder, this.col - 1)] =
            "potentialCapture";
        }
      }
    }

    this.checkIfKingInCheck(kingParameters);
    this.handlePiecePinnedByRook(kingParameters, board);
    this.handlePiecePinnedByBishop(kingParameters, board);

    return this.moves;
  };

  setRowCol = (row: number, col: number) => {
    this.row = row;
    this.col = col;
    this.hasMoved = true;
  };

  display() {
    return this.color[0].toUpperCase() + "P";
  }
}

export default Pawn;
