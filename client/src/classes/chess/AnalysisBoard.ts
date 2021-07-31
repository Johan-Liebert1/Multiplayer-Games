import {
  ChessBoardType,
  ChessPieceColor,
  ChessPieceName,
  PiecePosition
} from "../../types/chessTypes";
import { ClickedCellsType } from "../../types/games";
import ChessGame from "./ChessGame";

class AnalysisBoard extends ChessGame {
  movesList: ClickedCellsType[];
  currentMove: number;
  promotionMoveIndices: { [key: number]: ChessPieceName };

  constructor(
    moveList: ClickedCellsType[],
    promotionMoveIndices: { [key: number]: ChessPieceName },
    turn: ChessPieceColor = "white",
    whiteKingPos: PiecePosition = [7, 4],
    blackKingPos: PiecePosition = [0, 4]
  ) {
    super(turn, whiteKingPos, blackKingPos);

    this.movesList = moveList;
    this.promotionMoveIndices = promotionMoveIndices;
    this.currentMove = 0;
  }

  playNextMove = (board: ChessBoardType) => {
    if (this.currentMove >= this.movesList.length) return;

    const moveToPlay = this.movesList[this.currentMove];

    this.movePiece(board, moveToPlay);

    if (this.currentMove in this.promotionMoveIndices) {
      this.promotePawn(board, this.promotionMoveIndices[this.currentMove], moveToPlay);
    }

    this.currentMove++;
  };
}

export default AnalysisBoard;
