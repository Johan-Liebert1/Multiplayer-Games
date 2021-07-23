import CheckersPiece from "../classes/checkers/CheckersPiece";
import { MoveType } from "./games";

export type CheckersPieceColor = "white" | "red";
export type CheckersBoardType = (CheckersPiece | number | "dot")[][];
export type ValidCheckersMove = { [key: string]: "valid" };
export type CapturingCheckersMove = {
  [key: string]: { capturing: { row: number; col: number } };
};
export type CheckersMoveType = ValidCheckersMove | CapturingCheckersMove;
export type CheckersWinner = CheckersPieceColor | "Draw" | "";
