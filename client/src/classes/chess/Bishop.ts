import {
  ChessBoardType,
  ChessPieceColor,
  KingParametersType,
  PiecePosition,
  ValidChessMove
} from "../../types/chessTypes";
import ChessPiece from "./ChessPiece";

import { getStr } from "../../helpers/globalHelpers";

class Bishop extends ChessPiece {
  constructor(color: ChessPieceColor, row: number, col: number) {
    super(color, row, col);
    this.pieceName = "bishop";
    this.image = `images/chess/${this.color}Bishop.png`;
  }

  upperRight = (board: ChessBoardType) => {
    let c = this.col;
    for (let r = this.row - 1; r >= 0; r--) {
      if (c === 7) break;
      else c++;

      const piece = board[r][c];

      if (piece instanceof ChessPiece) {
        if (piece.color === this.color) {
          this.protectingMoves[getStr(r, c)] = "protecting";
          return;
        } else {
          this.moves[getStr(r, c)] = "capturing";
          return;
        }
      }

      this.moves[getStr(r, c)] = "valid";
    }
  };

  lowerRight = (board: ChessBoardType) => {
    let c = this.col;
    for (let r = this.row + 1; r < 8; r++) {
      if (c === 7) break;
      else c++;

      const piece = board[r][c];

      if (piece instanceof ChessPiece) {
        if (piece.color === this.color) {
          this.protectingMoves[getStr(r, c)] = "protecting";
          return;
        } else {
          this.moves[getStr(r, c)] = "capturing";
          return;
        }
      }

      this.moves[getStr(r, c)] = "valid";
    }
  };

  upperLeft = (board: ChessBoardType) => {
    let c = this.col;
    for (let r = this.row - 1; r >= 0; r--) {
      if (c === 0) break;
      else c--;
      const piece = board[r][c];

      if (piece instanceof ChessPiece) {
        if (piece.color === this.color) {
          this.protectingMoves[getStr(r, c)] = "protecting";
          return;
        } else {
          this.moves[getStr(r, c)] = "capturing";
          return;
        }
      }

      this.moves[getStr(r, c)] = "valid";
    }
  };

  lowerLeft = (board: ChessBoardType) => {
    let c = this.col;
    for (let r = this.row + 1; r < 8; r++) {
      if (c === 0) break;
      else c--;
      const piece = board[r][c];

      if (piece instanceof ChessPiece) {
        if (piece.color === this.color) {
          this.protectingMoves[getStr(r, c)] = "protecting";

          return;
        } else {
          this.moves[getStr(r, c)] = "capturing";
          return;
        }
      }

      this.moves[getStr(r, c)] = "valid";
    }
  };

  getCellsBetweenPieces = (kingPos: PiecePosition) => {
    let rowAdder = 0,
      colAdder = 0;
    let kingRow = kingPos[0],
      kingCol = kingPos[1];

    let cellsBetweenPieces: ValidChessMove = {};

    // upper left
    if (kingRow < this.row && kingCol < this.col) {
      rowAdder = -1;
      colAdder = -1;
    } else if (kingRow < this.row && kingCol > this.col) {
      // upper right
      rowAdder = -1;
      colAdder = 1;
    } else if (kingRow > this.row && kingCol < this.col) {
      // lower left
      rowAdder = 1;
      colAdder = -1;
    } else if (kingRow > this.row && kingCol > this.col) {
      // lower right
      rowAdder = 1;
      colAdder = 1;
    }

    let row = this.row + rowAdder,
      col = this.col + colAdder;

    while (row !== kingRow && col !== kingCol) {
      cellsBetweenPieces[getStr(row, col)] = "valid";
      row += rowAdder;
      col += colAdder;
    }

    return cellsBetweenPieces;
  };

  validMoves = (board: ChessBoardType, kingParameters: KingParametersType) => {
    this.resetMoves();

    this.upperRight(board);
    this.lowerRight(board);
    this.upperLeft(board);
    this.lowerLeft(board);

    this.checkIfKingInCheck(kingParameters);
    this.handlePiecePinnedByRook(kingParameters, board);
    this.handlePiecePinnedByBishop(kingParameters, board);

    return this.moves;
  };

  display() {
    return this.color[0].toUpperCase() + "B";
  }
}

export default Bishop;
