import { NewChessBoard } from "../../types/chessTypes";
import { NewPawn } from "./NewPawn";
import { NewRook } from "./NewRook";
import { NewQueen } from "./NewQueen";
import { NewBishop } from "./NewBishop";
import { NewKing } from "./NewKing";
import { NewKnight } from "./NewKnight";

export class NewChessGame {
    board: NewChessBoard;

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
            ) as NewChessBoard;

        for (let i = 0; i < 8; i++) {
            array[1][i] = new NewPawn("white", "pawn", 1, i);
        }

        array[0][0] = new NewRook("white", "rook", 0, 0);
        array[0][1] = new NewKnight("white", "knight", 0, 1);
        array[0][2] = new NewBishop("white", "bishop", 0, 2);
        array[0][3] = new NewKing("white", "king", 0, 3);
        array[0][4] = new NewQueen("white", "queen", 0, 4);
        array[0][5] = new NewBishop("white", "bishop", 0, 5);
        array[0][6] = new NewKnight("white", "knight", 0, 6);
        array[0][7] = new NewRook("white", "rook", 0, 7);

        return array;
    }

    movePiece(cells: [number, number][]) {
        const [prevRow, prevCol] = cells[0];
        const [newRow, newCol] = cells[1];

        const piece = this.board[prevRow][prevCol];

        if (piece === 0) return;

        this.board[newRow][newCol] = piece;
        this.board[prevRow][prevCol] = 0;

        piece.moveTo(cells[1]);
    }
}
