import { ChessPieceColor, ChessPieceName } from "../../types/chessTypes";
import { NewChessGame } from "./NewChessGame";
import { NewChessPiece } from "./NewChessPiece";

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

    calculateMoves(game: NewChessGame) {
        const adder = this.color === "white" ? 1 : -1;

        // pawn becomes another piece at the end of the board so we don't need to
        // do row boundary checks

        // forward move
        if (game.board[this.row + adder][this.col] === 0) {
            this.addMove("valid", this.row + adder, this.col);

            // double forward move
            if (
                !this.hasMoved &&
                game.board[this.row + 2 * adder][this.col] === 0
            ) {
                this.addMove("valid", this.row + adder * 2, this.col);
            }
        }

        // capturing move
        // TODO: handle en passent
        if (this.col - 1 > 0) {
            let piece = game.board[this.row + adder][this.col - 1];

            if (piece instanceof NewChessPiece && piece.color !== this.color) {
                this.addMove("capturing", piece.row, piece.col);
            }
        }

        if (this.col + 1 < 8) {
            let piece = game.board[this.row + adder][this.col + 1];

            if (piece instanceof NewChessPiece && piece.color !== this.color) {
                this.addMove("capturing", piece.row, piece.col);
            }
        }
    }
}
