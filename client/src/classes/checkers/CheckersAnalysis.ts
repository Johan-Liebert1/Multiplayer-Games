import { CheckersBoardType } from "../../types/checkersTypes";
import { ClickedCellsType } from "../../types/games";
import CheckersGame from "./CheckersGame";

class CheckersAnalysis extends CheckersGame {
  movesList: ClickedCellsType[];
  currentMove: number;

  constructor(moveList: ClickedCellsType[]) {
    super();
    this.movesList = moveList;
    this.currentMove = 0;
  }

  playNextMove = (board: CheckersBoardType) => {
    if (this.currentMove >= this.movesList.length) return;

    const moveToPlay = this.movesList[this.currentMove];

    this.movePiece(board, moveToPlay);

    this.currentMove++;
  };
}

export default CheckersAnalysis;
