import Pawn from "../classes/chess/Pawn";
import Rook from "../classes/chess/Rook";
import Knight from "../classes/chess/Knight";
import Bishop from "../classes/chess/Bishop";
import King from "../classes/chess/King";
import Queen from "../classes/chess/Queen";
import Piece from "../classes/chess/ChessPiece";
import { ChessBoardType, FenChars } from "../types/chessTypes";

const getPieceFromFenChar = (
  char: FenChars,
  row: number,
  col: number,
  canCastle: boolean
) => {
  switch (char) {
    case "r":
      return new Rook("black", row, col);
    case "R":
      return new Rook("white", row, col);

    case "p":
      return new Pawn("black", row, col);

    case "P":
      return new Pawn("white", row, col);

    case "k":
      return new King(
        "black",
        row,
        col
        // canCastle.canBlackCastleLeft,
        // canCastle.canBlackCastleRight
      );

    case "K":
      return new King(
        "white",
        row,
        col
        // canCastle.canWhiteCastleLeft,
        // canCastle.canWhiteCastleRight
      );

    case "b":
      return new Bishop("black", row, col);
    case "B":
      return new Bishop("white", row, col);

    case "n":
      return new Knight("black", row, col);
    case "N":
      return new Knight("white", row, col);

    case "q":
      return new Queen("black", row, col);
    case "Q":
      return new Queen("white", row, col);

    default:
      return 0;
  }
};

export const generateBoardFromFen = (fen: string, board: ChessBoardType, pgn: string) => {
  // pgn is the solution, but not in pgn

  const [actualFen, currentTurn, castlingRights, enPassant, zero, one] = fen.split(" ");

  let canCastle = {
    canBlackCastleLeft: false,
    canWhiteCastleLeft: false,
    canBlackCastleRight: false,
    canWhiteCastleRight: false
  };

  let blackKingPos, whiteKingPos;

  if (castlingRights && castlingRights.length > 0) {
    for (let i = 0; i < castlingRights.length; i++) {
      let char = castlingRights[i];

      if (char === "K") canCastle.canWhiteCastleRight = true;
      if (char === "Q") canCastle.canWhiteCastleLeft = true;
      if (char === "k") canCastle.canBlackCastleRight = true;
      if (char === "q") canCastle.canBlackCastleLeft = true;
    }
  }

  const whoseTurn = currentTurn === "w" ? "white" : "black";

  let row = 0,
    col = 0;

  let tempBoard = board.map(b => b);

  for (let i = 0; i < actualFen.length; i++) {
    const char = actualFen[i];
    let colIncremented = false;

    if (!isNaN(parseInt(char))) {
      // char is a number
      col += Number(char);
      colIncremented = true;
      continue;
    }

    if (char !== "/" && isNaN(parseInt(char))) {
      const piece = getPieceFromFenChar(char as FenChars, row, col, true);
      tempBoard[row][col] = piece;

      if (char === "k") {
        blackKingPos = [row, col];
      }

      if (char === "K") {
        whiteKingPos = [row, col];
      }
    }

    if (char === "/") {
      row++;
      col = 0;
    }

    if (!colIncremented && char !== "/") col++;
  }

  // also gotta set the king's initial positions
  // const game = new ChessGamePuzzle(whoseTurn, pgn, whiteKingPos, blackKingPos);

  return { tempBoard };
};

export const generateFenFromBoard = (board: ChessBoardType) => {
  const fenHelp = {
    king: "k",
    queen: "q",
    knight: "n",
    pawn: "p",
    rook: "r",
    bishop: "b"
  };
  let fen = "";
  let emptyColsPlaced = false;

  for (let i = 0; i < board.length; i++) {
    let emptyCols = 0;
    if (i !== 0) fen += "/";

    for (let j = 0; j < board.length; j++) {
      let piece = board[i][j];

      if (!(piece instanceof Piece)) {
        emptyCols += 1;
        emptyColsPlaced = false;
      } else if (piece.color === "black") {
        if (emptyCols !== 0) {
          fen += String(emptyCols);
          emptyCols = 0;
          emptyColsPlaced = true;
        }

        fen += fenHelp[piece.pieceName];
      } else if (piece.color === "white") {
        if (emptyCols !== 0) {
          fen += String(emptyCols);
          emptyCols = 0;
          emptyColsPlaced = true;
        }

        fen += fenHelp[piece.pieceName].toUpperCase();
      }

      if (emptyCols !== 0 && !emptyColsPlaced) {
        if (j === 7) {
          fen += String(emptyCols);
        }
      }
    }
  }
  return fen;
};
