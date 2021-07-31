import { ChessBoardType, ChessPieceColor, PiecePosition } from "../../types/chessTypes";
import { ClickedCellsType } from "../../types/games";
import ChessGame from "./ChessGame";

class AnalysisBoard extends ChessGame {
  movesList: ClickedCellsType[];
  currentMove: number;

  constructor(
    moveList: ClickedCellsType[],
    turn: ChessPieceColor = "white",
    whiteKingPos: PiecePosition = [7, 4],
    blackKingPos: PiecePosition = [0, 4]
  ) {
    super(turn, whiteKingPos, blackKingPos);

    this.movesList = moveList;
    this.currentMove = 0;
  }

  playNextMove = (board: ChessBoardType) => {
    if (this.currentMove >= this.movesList.length) return;

    this.movePiece(board, this.movesList[this.currentMove]);

    this.currentMove++;
  };
}

export default AnalysisBoard;
