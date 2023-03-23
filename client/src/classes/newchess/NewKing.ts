import { ChessPieceColor, ChessPieceName } from "../../types/chessTypes";
import { NewBishop } from "./NewBishop";
import { NewChessPiece } from "./NewChessPiece";
import { NewChessBoard } from "../../types/chessTypes";
import { NewRook } from "./NewRook";

const rowAdders = [1, 0, -1];
const colAdders = [
    [-1, 0, 1],
    [1, -1],
    [-1, 0, 1],
];

export class NewKing extends NewChessPiece {
    rook: NewRook;
    bishop: NewBishop;

    constructor(
        color: ChessPieceColor,
        name: ChessPieceName,
        row: number,
        col: number
    ) {
        super(color, name, row, col);
        this.rook = new NewRook(color, "rook", row, col);
        this.bishop = new NewBishop(color, "bishop", row, col);
    }

    calculateMoves(board: NewChessBoard) {
        this.moves = this.defaultMoves();

        for (let i = 0; i < rowAdders.length; i++) {
            for (const ca of colAdders[i]) {
                const newRow = this.row + rowAdders[i];
                const newCol = this.col + ca;

                if (this.rowColWithinBounds(newRow, newCol)) {
                    const piece = board[newRow][newCol];
                    if (piece === 0) {
                        // TODO: Handle squares under attack
                        this.addMove("valid", newRow, newCol);
                    } else if (piece.color !== this.color) {
                        // TODO: Handle protected pieces
                        this.addMove("capturing", newRow, newCol);
                    }
                }
            }
        }
    }
}
