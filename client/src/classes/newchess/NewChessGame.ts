import { NewChessPiece } from "./NewChessPiece";

const letters = "abcdefgh";
export const rowColToCellName = (row: number, col: number) =>
    `${letters[col]}${row + 1}`;

export class NewChessGame {
    board: (0 | NewChessPiece)[][];

    constructor() {
        this.board = this.setupBoard();
    }

    setupBoard() {
        const array = Array.from({ length: 8 })
            .fill(null)
            .map(() =>
                Array.from({ length: 8 })
                    .fill(null)
                    .map(() => 0)
            );

        return array as 0[][];
    }
}
