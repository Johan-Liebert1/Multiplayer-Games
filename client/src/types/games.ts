export type Games = "chess" | "checkers" | "sketchio";
export type MoveType = "valid" | "capturing";
export type ClickedCellsType = { rows: number[]; cols: number[] };
export const CELL_SIZE = 70;

export interface UpdateGameDetails {
  won: boolean;
  lost: boolean;
  drawn: boolean;
  started: boolean;
}
