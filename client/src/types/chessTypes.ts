import ChessPiece from "../classes/chess/test/ChessPiece";

export type ChessPieceColor = "white" | "black";
export type ChessPieceName =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king"
  | "";

export type ValidMoveType = "valid";
export type CapturingMoveType = "capturing";
export type ProtectingMoveType = "protecting";

export type ValidChessMove = {
  [key: string]: ValidMoveType | CapturingMoveType;
};
export type ProtectingChessMove = {
  [key: string]: ProtectingMoveType;
};

export type ChessBoardType = (ChessPiece | number | "dot")[][];

export type KingParametersType = {
  blackKingInCheck: boolean;
  whiteKingInCheck: boolean;
  pieceCheckingWhiteKing: ChessPiece | null;
  pieceCheckingBlackKing: ChessPiece | null;
  whiteKingPos: [number, number];
  blackKingPos: [number, number];
  cellsUnderAttackByWhite: ValidChessMove | ProtectingChessMove;
  cellsUnderAttackByBlack: ValidChessMove | ProtectingChessMove;
};

export type GenericKingParametersType = {
  pieceCheckingKing: ChessPiece | null;
  kingPos: [number, number];
};
