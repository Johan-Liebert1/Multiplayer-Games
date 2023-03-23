import { ChessPieceColor, ChessPieceName } from "../../types/chessTypes";
import { NewBishop } from "./NewBishop";
import { NewChessPiece } from "./NewChessPiece";
import { NewRook } from "./NewRook";
import { NewChessBoard } from "../../types/chessTypes";

export class NewQueen extends NewChessPiece {
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
        this.rook.calculateMoves(board);
        this.bishop.calculateMoves(board);

        this.moves = {
            valid: [...this.rook.moves["valid"], ...this.rook.moves["valid"]],
            capturing: [
                ...this.rook.moves["capturing"],
                ...this.rook.moves["capturing"],
            ],
            "check-blocking": [
                ...this.rook.moves["check-blocking"],
                ...this.rook.moves["check-blocking"],
            ],
        };
    }
}
