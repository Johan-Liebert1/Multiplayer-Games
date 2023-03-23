import { ChessPieceColor, ChessPieceName } from "../../types/chessTypes";
import { NewChessPiece } from "./NewChessPiece";
import { NewChessBoard } from "../../types/chessTypes";

const rowAdders = [1, -1, 0, 0];
const colAdders = [0, 0, 1, -1];

export class NewRook extends NewChessPiece {
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

    calculateMoves(board: NewChessBoard) {
        this.moves = this.defaultMoves();

        for (let i = 0; i < rowAdders.length; i++) {
            for (let j = 0; j < 8; j++) {
                const newRow = this.row + rowAdders[i] + (j * rowAdders[i]);
                const newCol = this.col + colAdders[i] + (j * colAdders[i]);


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
                } else {
                    break;
                }
            }
        }
    }
}
