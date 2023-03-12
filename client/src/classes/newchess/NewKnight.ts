import { ChessPieceColor, ChessPieceName } from "../../types/chessTypes";
import { NewChessGame } from "./NewChessGame";
import { NewChessPiece } from "./NewChessPiece";

const rowAdders = [2, -2, 1, -1];
const colAdders = [
    [-1, 1],
    [-1, 1],
    [-2, 2],
    [-2, 2],
];

export class NewKnight extends NewChessPiece {
    hasMoved: boolean;

    constructor(
        color: ChessPieceColor,
        name: ChessPieceName,
        row: number,
        col: number
    ) {
        super(color, name, row, col);
        this.hasMoved = false;
    }

    calculateMoves(game: NewChessGame) {
        for (let i = 0; i < rowAdders.length; i++) {
            const newRow = this.row + rowAdders[i];

            for (const ca of colAdders[i]) {
                const newCol = this.col + ca;

                if (this.rowColWithinBounds(newRow, newCol)) {
                    const piece = game.board[newRow][newCol];

                    if (piece === 0) {
                        this.addMove("valid", newRow, newCol);
                    } else if (piece instanceof NewChessPiece) {
                        if (piece.color !== this.color) {
                            this.addMove("capturing", newRow, newCol);
                        }
                    }
                }
            }
        }
    }
}
