import { getStr } from "../../helpers/globalHelpers";
import {
    ChessBoardType,
    ChessPieceColor,
    KingParametersType,
    PiecePosition,
    ValidChessMove,
} from "../../types/chessTypes";
import ChessPiece from "./ChessPiece";

class Rook extends ChessPiece {
    hasMoved: boolean;

    constructor(color: ChessPieceColor, row: number, col: number) {
        super(color, row, col);
        this.pieceName = "rook";
        this.hasMoved = false;
        this.image = `images/chess/${this.color}Rook.png`;
    }

    getCellsBetweenPieces = (kingPos: PiecePosition) => {
        let rowAdder = 0,
            colAdder = 0;

        let kingRow = kingPos[0],
            kingCol = kingPos[1];

        let cellsBetweenPieces: ValidChessMove = {};

        // up
        if (kingRow < this.row && kingCol === this.col) {
            rowAdder = -1;
            colAdder = 0;
        } else if (kingRow > this.row && kingCol === this.col) {
            //down
            rowAdder = 1;
            colAdder = 0;
        } else if (kingRow === this.row && kingCol < this.col) {
            // left
            rowAdder = 0;
            colAdder = -1;
        } else if (kingRow === this.row && kingCol > this.col) {
            // right
            rowAdder = 0;
            colAdder = 1;
        }

        if (rowAdder !== 0) {
            for (
                let row = this.row + rowAdder;
                row !== kingRow;
                row += rowAdder
            ) {
                cellsBetweenPieces[getStr(row, this.col)] = "valid";
            }
        }

        if (colAdder !== 0) {
            for (
                let col = this.col + colAdder;
                col !== kingCol;
                col += colAdder
            ) {
                cellsBetweenPieces[getStr(this.row, col)] = "valid";
            }
        }

        return cellsBetweenPieces;
    };

    addMove = (board: ChessBoardType, row: number, col: number) => {
        const piece = board[row][col];

        if (piece instanceof ChessPiece) {
            if (piece.color === this.color) {
                this.protectingMoves[getStr(this.row, col)] = "protecting";
            } else {
                this.moves[getStr(this.row, col)] = "capturing";
            }
        }

        this.moves[getStr(this.row, col)] = "valid";
    };

    validMoves = (
        board: ChessBoardType,
        kingParameters: KingParametersType
    ) => {
        this.resetMoves();

        // go outwards from the current row, i.e iterate through columns
        for (let c = this.col - 1; c >= 0; c--) {
            this.addMove(board, this.row, c);
        }

        for (let c = this.col + 1; c < 8; c++) {
            this.addMove(board, this.row, c);
        }

        // go outwards from the current column, i.e iterate through rows
        for (let r = this.row - 1; r >= 0; r--) {
            this.addMove(board, r, this.col);
        }

        for (let r = this.row + 1; r < 8; r++) {
            this.addMove(board, r, this.col);
        }

        console.log('after adding all move');

        this.checkIfKingInCheck(kingParameters);
        console.log('this.checkIfKingInCheck(kingParameters);')

        this.handlePiecePinnedByRook(kingParameters, board);
        console.log('this.handlePiecePinnedByRook(kingParameters, board);')

        this.handlePiecePinnedByBishop(kingParameters, board);
        console.log('this.handlePiecePinnedByBishop(kingParameters, board);')

        return this.moves;
    };

    setRowCol = (row: number, col: number) => {
        this.row = row;
        this.col = col;
        this.hasMoved = true;
    };
}

export default Rook;
