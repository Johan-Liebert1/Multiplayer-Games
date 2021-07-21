import { getStr } from "../../helpers/globalHelpers";
import { ChessPieceColor } from "../../types/chessTypes";
import Piece from "./ChessPiece";

class Knight extends Piece {
  constructor(color: ChessPieceColor, row: number, col: number) {
    super(color, row, col);
    this.pieceName = "knight";
    this.image = `images/chess/${this.color}Knight.png`;
  }

  validMoves = (board, kingParameters) => {
    this.resetMoves();

    let arrC = [-2, -1, 1, 2];
    let arrR = [1, 2, 2, 1];
    // -2 and 2 at -1 and 1
    // -1 and 1 at -2 and 2

    for (let i = 0; i < 4; i++) {
      if (this.col + arrC[i] >= 0 && this.col + arrC[i] < 8) {
        // ---

        if (this.row - arrR[i] >= 0) {
          const cell = board[this.row - arrR[i]][this.col + arrC[i]];

          if (cell === 0) {
            this.moves[getStr(this.row - arrR[i], this.col + arrC[i])] = "valid";
          } else if (cell.color !== this.color) {
            this.moves[getStr(this.row - arrR[i], this.col + arrC[i])] = "capturing";
          } else if (cell.color === this.color) {
            this.protectingMoves[getStr(this.row - arrR[i], this.col + arrC[i])] =
              "protecting";
          }
        }

        if (this.row + arrR[i] < 8) {
          const cell = board[this.row + arrR[i]][this.col + arrC[i]];

          if (cell === 0) {
            this.moves[getStr(this.row + arrR[i], this.col + arrC[i])] = "valid";
          } else if (cell.color !== this.color) {
            this.moves[getStr(this.row + arrR[i], this.col + arrC[i])] = "capturing";
          } else if (cell.color === this.color) {
            this.protectingMoves[getStr(this.row + arrR[i], this.col + arrC[i])] =
              "protecting";
          }
        }
      }
    }

    this.checkIfKingInCheck(kingParameters);
    this.handlePiecePinnedByRook(kingParameters, board);
    this.handlePiecePinnedByBishop(kingParameters, board);

    return this.moves;
  };

  display() {
    return this.color[0].toUpperCase() + "Kn";
  }
}

export default Knight;
