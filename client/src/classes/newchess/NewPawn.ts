import { ChessPieceColor, ChessPieceName } from "../../types/chessTypes";
import { NewChessPiece } from "./NewChessPiece";
import { NewChessBoard } from "../../types/chessTypes";

export class NewPawn extends NewChessPiece {
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

        const adder = this.color === "white" ? 1 : -1;

        // pawn becomes another piece at the end of the board so we don't need to
        // do row boundary checks

        // forward move
        if (
            this.rowColWithinBounds(this.row + adder, this.col) &&
            board[this.row + adder][this.col] === 0
        ) {
            this.addMove("valid", this.row + adder, this.col);

            // double forward move
            if (
                !this.hasMoved &&
                this.rowColWithinBounds(this.row + 2 * adder, this.col) &&
                board[this.row + 2 * adder][this.col] === 0
            ) {
                this.addMove("valid", this.row + adder * 2, this.col);
            }
        }

        // capturing move
        // TODO: handle en passent
        if (this.col - 1 > 0) {
            let piece = board[this.row + adder][this.col - 1];

            if (piece instanceof NewChessPiece && piece.color !== this.color) {
                this.addMove("capturing", piece.row, piece.col);
            }
        }

        if (this.col + 1 < 8) {
            let piece = board[this.row + adder][this.col + 1];

            if (piece instanceof NewChessPiece && piece.color !== this.color) {
                this.addMove("capturing", piece.row, piece.col);
            }
        }
    }
}
