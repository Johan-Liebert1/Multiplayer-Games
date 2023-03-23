import { ChessPieceColor, ChessPieceName, NewChessBoard } from "../../types/chessTypes";
import { NewChessPiece } from "./NewChessPiece";

const rowAdders = [1, -1];
const colAdders = [
    [-1, 1],
    [-1, 1],
];

export class NewBishop extends NewChessPiece {
    constructor(
        color: ChessPieceColor,
        name: ChessPieceName,
        row: number,
        col: number
    ) {
        super(color, name, row, col);
    }

    calculateMoves(board: NewChessBoard) {
        this.moves = this.defaultMoves();

        for (let i = 0; i < rowAdders.length; i++) {
            for (let j = 0; j < colAdders[i].length; j++) {
                for (let inc = 0; inc < 8; inc++) {
                    const newRow = this.row + rowAdders[i] + (rowAdders[i] * inc);
                    const newCol = this.col + colAdders[i][j] + (colAdders[i][j] * inc);

                    if (this.rowColWithinBounds(newRow, newCol)) {
                        const piece = board[newRow][newCol];

                        if (piece === 0) {
                            this.addMove("valid", newRow, newCol);
                        } else if (piece instanceof NewChessPiece) {
                            if (piece.color !== this.color) {
                                this.addMove("capturing", newRow, newCol);
                            }

                            // the rook can't move over the piece, so we break
                            break;
                        }
                    }
                }
            }
        }
    }
}
