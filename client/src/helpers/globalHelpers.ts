import { ChessPieceName } from "../types/chessTypes";
import { ClickedCellsType } from "../types/games";

export const getStr = (r: number, c: number) => `${r},${c}`;
export const getRowCol = (str: string) => str.split(",").map(Number);

export const getEmptyMatrix = (size: number) =>
  new Array(size).fill(0).map(() => new Array(size).fill(0));

export const getChessMovesFromString = (
  apiRespMoves: string
): {
  moves: ClickedCellsType[];
  promotionMoveIndices: { [key: number]: ChessPieceName };
} => {
  const moves: ClickedCellsType[] = [];
  const promotionMoveIndices: { [key: number]: ChessPieceName } = {};

  //6,4;3,3:1,3;4,4:4,3;3,4:1,2;5,5:3,2;4,5=queen:0,2;6,5:7,5;1,2:0,4;5,1:7,5;3,3:0,0;4,6:7,3;2,6:4,5;1,2:

  const intermediate = apiRespMoves.split(":");

  for (let i = 0; i < intermediate.length - 1; i++) {
    const potentialRows = intermediate[i].split(";")[0];
    let potentialCols = intermediate[i].split(";")[1];

    if (potentialCols.includes("=")) {
      // pawn promotion
      promotionMoveIndices[i] = potentialCols.split("=")[1] as ChessPieceName;

      potentialCols = potentialCols.split("=")[0];
    }

    const rows = potentialRows.split(",").map(Number);
    const cols = potentialCols.split(",").map(Number);

    moves.push({ rows, cols });
  }

  return { moves, promotionMoveIndices };
};

export const getCheckersMovesFromString = (apiRespMoves: string): ClickedCellsType[] => {
  const moves: ClickedCellsType[] = [];

  //6,4;3,3:1,3;4,4:4,3;3,4:1,2;5,5:3,2;2;5;4,5:0,2;6,5:

  const intermediate = apiRespMoves.split(":");

  for (let i = 0; i < intermediate.length - 1; i++) {
    const list = intermediate[i].split(";");

    const rows = list[0].split(",").map(Number);
    const cols = list[1].split(",").map(Number);

    moves.push({ rows, cols });
  }

  return moves;
};
