import ChessPiece from "../classes/chess/ChessPiece";

export type ChessDrawType = "Stalemate" | "Insufficient Pieces";

export const waysToDraw: { [key: string]: ChessDrawType } = Object.freeze({
  STALEMATE: "Stalemate",
  INSUFFICIENT_PIECES: "Insufficient Pieces"
});

export type ChessPieceColor = "white" | "black";
export type ChessPieceName = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export type ChessWinner =
  | ChessPieceColor
  | "Draw by Stalemate"
  | "Draw by Insufficient Pieces"
  | "";

export type ValidMoveType = "valid";
export type CapturingMoveType = "capturing";
export type ProtectingMoveType = "protecting";
export type CastlingMoveType = "castling";
export type InvalidMoveType = "invalid";

export type ValidChessMove = {
  [key: string]: ValidMoveType | CapturingMoveType | CastlingMoveType;
};

export type InvalidChessMove = {
  [key: string]: InvalidMoveType;
};

export type ProtectingChessMove = {
  [key: string]: ProtectingMoveType;
};

export type ChessBoardType = (ChessPiece | number | "dot")[][];

export type PiecePosition = [number, number];

export type KingParametersType = {
  blackKingInCheck: boolean;
  whiteKingInCheck: boolean;
  pieceCheckingWhiteKing: ChessPiece | null;
  pieceCheckingBlackKing: ChessPiece | null;
  whiteKingPos: PiecePosition;
  blackKingPos: PiecePosition;
  cellsUnderAttackByWhite: ValidChessMove | ProtectingChessMove;
  cellsUnderAttackByBlack: ValidChessMove | ProtectingChessMove;
};

export type GenericKingParametersType = {
  pieceCheckingKing: ChessPiece | null;
  kingPos: PiecePosition;
};
