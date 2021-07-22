import ChessPiece from "./ChessPiece";
import Rook from "./Rook";

import { getStr } from "../../helpers/globalHelpers";
import {
  ChessBoardType,
  ChessPieceColor,
  GenericKingParametersType,
  InvalidChessMove,
  KingParametersType,
  ValidChessMove
} from "../../types/chessTypes";

class King extends ChessPiece {
  hasMoved: boolean;
  invalidMoves: InvalidChessMove;
  canCastleLeft: boolean | null;
  canCastleRight: boolean | null;

  constructor(
    color: ChessPieceColor,
    row: number,
    col: number,
    canCastleLeft = null,
    canCastleRight = null
  ) {
    super(color, row, col);
    this.pieceName = "king";
    this.image = `images/chess/${this.color}King.png`;
    this.isKing = true;
    this.hasMoved = false;
    this.invalidMoves = {};

    // for puzzles
    this.canCastleLeft = canCastleLeft;
    this.canCastleRight = canCastleRight;
  }

  notAllowKingToMoveToAttackedCell = (kingParameters: KingParametersType) => {
    // not allow king to capture a protected piece
    let newValidMoves = {};
    let newInvalidMoves = {};

    const { cellsUnderAttackByWhite, cellsUnderAttackByBlack } = kingParameters;
    const cellsUnderAttack =
      this.color === "white" ? cellsUnderAttackByBlack : cellsUnderAttackByWhite;

    const moveKeys = Object.keys(this.moves);

    for (const move of moveKeys) {
      if (move in cellsUnderAttack) {
        this.invalidMoves[move] = "invalid";
      }
    }

    this.invalidMoves = newInvalidMoves;

    return newValidMoves;
  };

  isPathBetweenRookAndKingBlocked = (
    board: ChessBoardType,
    rookColor: ChessPieceColor
  ) => {
    const row = rookColor === "white" ? 7 : 0;
    const blockedPath = { leftBlocked: false, rightBlocked: false };

    const leftCols = [1, 2, 3];
    const rightCols = [5, 6];

    leftCols.forEach(col => {
      if (board[row][col] instanceof ChessPiece) blockedPath.leftBlocked = true;
    });

    rightCols.forEach(col => {
      if (board[row][col] instanceof ChessPiece) blockedPath.rightBlocked = true;
    });

    return blockedPath;
  };

  isRookPresent = (board: ChessBoardType, rookColor: ChessPieceColor) => {
    const row = rookColor === "white" ? 7 : 0;

    const leftRook = board[row][0];
    const rightRook = board[row][7];

    if (!(leftRook instanceof Rook) && !(rightRook instanceof Rook)) return false;
    else if (leftRook instanceof Rook && leftRook.hasMoved) return false;
    else if (rightRook instanceof Rook && rightRook.hasMoved) return false;

    return true;
  };

  addCastlingMoves = (board: ChessBoardType, kingParameters: KingParametersType) => {
    if (this.canCastleLeft !== null || this.canCastleRight !== null) {
      // this is for puzzles

      if (this.canCastleLeft === true) {
        this.moves[getStr(this.row, this.col - 2)] = "castling";
      }

      if (this.canCastleRight === true) {
        this.moves[getStr(this.row, this.col + 2)] = "castling";
      }

      return;
    }

    const { whiteKingInCheck, blackKingInCheck } = kingParameters;

    if (this.hasMoved) return;

    if (this.color === "white") {
      // if there's an unmoved Rook
      if (whiteKingInCheck) return;
      if (this.row !== 7) return;

      // if there's no rook then return
      if (!this.isRookPresent(board, this.color)) return;

      // if any piece is blocking the path between both rooks and king, return
      const { leftBlocked, rightBlocked } = this.isPathBetweenRookAndKingBlocked(
        board,
        this.color
      );

      if (leftBlocked && rightBlocked) return; // both paths are blocked

      if (!leftBlocked) {
        this.moves[getStr(this.row, this.col - 2)] = "castling";
      }

      if (!rightBlocked) {
        this.moves[getStr(this.row, this.col + 2)] = "castling";
      }
    } else {
      if (blackKingInCheck) return;
      if (this.row !== 0) return;
      if (!this.isRookPresent(board, this.color)) return;

      const { leftBlocked, rightBlocked } = this.isPathBetweenRookAndKingBlocked(
        board,
        this.color
      );

      if (leftBlocked && rightBlocked) return;

      if (!leftBlocked) {
        this.moves[getStr(this.row, this.col - 2)] = "castling";
      }

      if (!rightBlocked) {
        this.moves[getStr(this.row, this.col + 2)] = "castling";
      }
    }
  };

  handleKingInCheckByRook = ({ pieceCheckingKing }: GenericKingParametersType) => {
    if (!pieceCheckingKing) return;

    let newValidMoves: ValidChessMove = {};
    let rookSquares = {} as { [key: string]: boolean };

    let row = pieceCheckingKing.row + 1,
      col = pieceCheckingKing.col;
    // up (row--)
    while (row > -1) {
      rookSquares[getStr(row, col)] = true;
      row--;
    }

    // down (row++)
    row = pieceCheckingKing.row - 1;
    while (row < 8) {
      rookSquares[getStr(row, col)] = true;
      row++;
    }

    // left (col--)
    row = pieceCheckingKing.row;
    col = pieceCheckingKing.col - 1;
    while (col > -1) {
      rookSquares[getStr(row, col)] = true;
      col--;
    }

    // right (col++)
    col = pieceCheckingKing.col + 1;
    while (col < 8) {
      rookSquares[getStr(row, col)] = true;
      col++;
    }

    Object.keys(this.moves).forEach(move => {
      if (!(move in rookSquares)) {
        newValidMoves[move] = this.moves[move];
      }
    });

    // capturing move
    let cm = getStr(pieceCheckingKing.row, pieceCheckingKing.col);

    if (cm in this.moves) {
      newValidMoves[cm] = this.moves[cm];
    }

    this.moves = newValidMoves;
  };

  handleKingInCheckByBishop = ({ pieceCheckingKing }: GenericKingParametersType) => {
    if (!pieceCheckingKing) return;

    // go upper left (row--, col--)
    let bishopSquares = {} as { [key: string]: boolean };

    let row = pieceCheckingKing.row - 1,
      col = pieceCheckingKing.col - 1;

    while (row > -1 && col > -1) {
      bishopSquares[getStr(row, col)] = true;
      row--;
      col--;
    }

    // upper right (row--, col++)
    row = pieceCheckingKing.row - 1;
    col = pieceCheckingKing.col + 1;
    while (row > -1 && col < 8) {
      bishopSquares[getStr(row, col)] = true;
      row--;
      col++;
    }

    // lower left (row++, col--)
    row = pieceCheckingKing.row + 1;
    col = pieceCheckingKing.col - 1;
    while (row < 8 && col > -1) {
      bishopSquares[getStr(row, col)] = true;
      row++;
      col--;
    }

    // lower right (row++, col++)
    row = pieceCheckingKing.row + 1;
    col = pieceCheckingKing.col + 1;
    while (row < 8 && col < 8) {
      bishopSquares[getStr(row, col)] = true;
      row++;
      col++;
    }

    let newValidMoves: ValidChessMove = {};

    Object.keys(this.moves).forEach(move => {
      if (!(move in bishopSquares)) {
        newValidMoves[move] = this.moves[move];
      }
    });

    let cm = getStr(pieceCheckingKing.row, pieceCheckingKing.col);

    if (cm in this.moves) {
      newValidMoves[cm] = this.moves[cm];
    }

    this.moves = newValidMoves;
  };

  handleKingInCheckByQueen = (genericKingParams: GenericKingParametersType) => {
    this.handleKingInCheckByRook(genericKingParams);
    this.handleKingInCheckByBishop(genericKingParams);
  };

  validMoves = (board: ChessBoardType, kingParameters: KingParametersType) => {
    this.resetMoves();

    const rowsArray = [
      [-1, 0, 1],
      [-1, 1],
      [-1, 0, 1]
    ];
    const colsArray = [this.col - 1, this.col, this.col + 1];

    colsArray.forEach((column, i) => {
      if (column > -1 && column < 8) {
        rowsArray[i].forEach(rowAdder => {
          if (this.row + rowAdder > -1 && this.row + rowAdder < 8) {
            let piece = board[this.row + rowAdder][column];

            if (piece === 0) {
              this.moves[getStr(this.row + rowAdder, column)] = "valid";
            } else if (piece instanceof ChessPiece && piece.color !== this.color) {
              this.moves[getStr(this.row + rowAdder, column)] = "capturing";
            } else if (piece instanceof ChessPiece && piece.color === this.color) {
              this.protectingMoves[getStr(this.row + rowAdder, column)] = "protecting";
            }
          }
        });
      }
    });

    // castling
    this.addCastlingMoves(board, kingParameters);

    const {
      whiteKingInCheck,
      blackKingInCheck,
      pieceCheckingWhiteKing,
      pieceCheckingBlackKing,
      blackKingPos,
      whiteKingPos
    } = kingParameters;

    if (this.color === "white" && pieceCheckingWhiteKing) {
      let obj: GenericKingParametersType = {
        pieceCheckingKing: pieceCheckingWhiteKing,
        kingPos: whiteKingPos
      };

      if (pieceCheckingWhiteKing.pieceName === "rook") {
        this.handleKingInCheckByRook(obj);
      } else if (pieceCheckingWhiteKing.pieceName === "bishop") {
        this.handleKingInCheckByBishop(obj);
      } else if (pieceCheckingWhiteKing.pieceName === "queen") {
        this.handleKingInCheckByQueen(obj);
      }
    } else if (this.color === "black" && pieceCheckingBlackKing) {
      let obj: GenericKingParametersType = {
        pieceCheckingKing: pieceCheckingBlackKing,
        kingPos: blackKingPos
      };

      if (pieceCheckingBlackKing.pieceName === "rook") {
        this.handleKingInCheckByRook(obj);
      } else if (pieceCheckingBlackKing.pieceName === "bishop") {
        this.handleKingInCheckByBishop(obj);
      } else if (pieceCheckingBlackKing.pieceName === "queen") {
        this.handleKingInCheckByQueen(obj);
      }
    }

    this.moves = this.notAllowKingToMoveToAttackedCell(kingParameters);

    return this.moves;
  };

  setRowCol = (row: number, col: number) => {
    this.row = row;
    this.col = col;
    this.hasMoved = true;
  };

  display() {
    return this.color[0].toUpperCase() + "K";
  }
}

export default King;
