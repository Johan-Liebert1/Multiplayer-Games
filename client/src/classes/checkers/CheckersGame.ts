import { getRowCol, getStr } from "../../helpers/globalHelpers";
import {
  CapturingCheckersMove,
  CheckersBoardType,
  CheckersMoveType,
  CheckersPieceColor,
  ValidCheckersMove
} from "../../types/checkersTypes";
import { ClickedCellsType } from "../../types/games";
import CheckersPiece from "./CheckersPiece";

class CheckersGame {
  cellsClicked: ClickedCellsType;
  numClicks: number;
  turn: CheckersPieceColor;
  selected: CheckersPiece | null;
  redPiecesOnBoard: number;
  whitePiecesOnBoard: number;
  gameOver: boolean;
  winner: CheckersPieceColor | null;

  constructor() {
    this.cellsClicked = { rows: [], cols: [] };
    this.numClicks = 0;
    this.turn = "white";
    this.selected = null;
    this.redPiecesOnBoard = 8;
    this.whitePiecesOnBoard = 8;
    this.gameOver = false;
    this.winner = null;
  }

  clearDots = (board: CheckersBoardType): void => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === "dot") board[i][j] = 0;
      }
    }
  };

  showDots = (board: CheckersBoardType, moves: CheckersMoveType): void => {
    Object.entries(moves).forEach(
      ([key, actualMove]: [
        string,
        "valid" | { capturing: { row: number; col: number } }
      ]) => {
        // key = row,col
        const [row, col] = getRowCol(key);

        if (actualMove === "valid") {
          board[row][col] = "dot";
        } else {
          board[row][col] = "dot";
        }
      }
    );
  };

  showValidMoves = (
    userColor: CheckersPieceColor,
    board: CheckersBoardType,
    row: number,
    col: number
  ) => {
    const cell = board[row][col];

    if (cell instanceof CheckersPiece) {
      if (cell.color !== userColor) return;
    }

    this.clearDots(board);

    if (cell instanceof CheckersPiece) {
      if (cell.color === this.turn) {
        let piece = cell;
        let pieceMoves = piece.validMoves(board);

        this.showDots(board, pieceMoves);

        // piece.isClicked = true;
      }
    }

    let tempCellsClicked = this.select(board, row, col);

    return tempCellsClicked;
  };

  select = (board: CheckersBoardType, row: number, col: number) => {
    // console.log("select called");
    const cell = board[row][col];

    if (this.numClicks === 0) {
      if (!(cell instanceof CheckersPiece)) return;
      if (cell.color !== this.turn) return;

      this.cellsClicked.rows.push(row);
      this.cellsClicked.cols.push(col);
      this.numClicks++;
      return this.cellsClicked;
    } else if (this.numClicks === 1) {
      // a piece has already been clicked

      if (cell instanceof CheckersPiece) {
        // if player clicked on another piece of his color, do not changeTurn
        if (cell.color === this.turn) {
          this.cellsClicked.rows[0] = row;
          this.cellsClicked.cols[0] = col;
          return this.cellsClicked;
        }
      }

      let str = getStr(row, col);
      let piece = board[this.cellsClicked.rows[0]][
        this.cellsClicked.cols[0]
      ] as CheckersPiece;
      const validPieceMoves = piece.validMoves(board);

      if (!(str in validPieceMoves)) {
        return;
      }

      // update this.cellsClicked for socket connection
      this.cellsClicked.rows.push(row);
      this.cellsClicked.cols.push(col);

      let tempCellsClicked = this.movePiece(board, this.cellsClicked, validPieceMoves);

      return tempCellsClicked;
    }
  };

  movePiece = (
    board: CheckersBoardType,
    clickedCells: ClickedCellsType,
    validPieceMoves?: CheckersMoveType
  ) => {
    // clicked cells is basically this.cellsClicked, but we take it as a
    // parameter so that we can also use it for sockets

    let { rows, cols } = clickedCells;

    const [rowi, rowf] = rows;
    const [coli, colf] = cols;

    // can be absolutely sure that rows and cols in clickedCells always contain a checker's piece
    const piece = board[rowi][coli] as CheckersPiece;

    if (!validPieceMoves) {
      validPieceMoves = piece.validMoves(board);
    }

    const actualMove = validPieceMoves[getStr(rowf, colf)];

    if (actualMove === "valid") {
      // not a capturing move
      piece.setRowCol(rowf, colf);

      // clicked cell is a valid move
      board[rowi][coli] = 0;
      board[rowf][colf] = piece;
    } else {
      // if it is a capturing move then the info about the piece captured
      // is stored in the second position of the array
      const { row, col } = actualMove.capturing;

      let capturedPiece = board[row][col] as CheckersPiece;
      piece.setRowCol(rowf, colf);

      if (capturedPiece.isKing) {
        piece.makeKing();
      }

      if (capturedPiece.color === "white") {
        this.whitePiecesOnBoard--;
      } else if (capturedPiece.color === "red") {
        this.redPiecesOnBoard--;
      }

      // clicked cell is a valid move
      board[rowi][coli] = 0;
      board[row][col] = 0; // remove the captured piece
      board[rowf][colf] = piece;
    }

    let tcc = this.cellsClicked;

    this.clearDots(board);
    this.changeTurn();

    console.log({ red: this.redPiecesOnBoard, white: this.whitePiecesOnBoard });

    return tcc;
  };

  colorHasMovesLeft = (board: CheckersBoardType, color: CheckersPieceColor) => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        const cell = board[row][col];

        if (cell instanceof CheckersPiece && cell.color === color) {
          const moves = cell.validMoves(board);
          if (Object.keys(moves).length > 0) {
            return true;
          }
        }
      }
    }

    return false;
  };

  redWins = () => {
    this.gameOver = true;
    this.winner = "red";
    return this.gameOver;
  };

  whiteWins = () => {
    this.gameOver = true;
    this.winner = "white";
    return this.gameOver;
  };

  isGameOver = (board: CheckersBoardType) => {
    if (this.turn === "red") {
      if (this.redPiecesOnBoard === 0) {
        return this.whiteWins();
      }
    } else {
      if (this.whitePiecesOnBoard === 0) {
        return this.redWins();
      }
    }

    if (!this.colorHasMovesLeft(board, "red")) {
      return this.whiteWins();
    }

    if (!this.colorHasMovesLeft(board, "white")) {
      return this.redWins();
    }

    return false;
  };

  changeTurn = () => {
    this.cellsClicked = { rows: [], cols: [] };
    this.numClicks = 0;

    this.turn = this.turn === "white" ? "red" : "white";
  };
}

export default CheckersGame;
