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

    validMoves = (
        board: ChessBoardType,
        kingParameters: KingParametersType
    ) => {
        this.resetMoves();

        // go outwards from the current row, i.e iterate through columns
        for (let c = this.col - 1; c >= 0; c--) {
            const piece = board[this.row][c];

            if (piece instanceof ChessPiece) {
                if (piece.color === this.color) {
                    this.protectingMoves[getStr(this.row, c)] = "protecting";
                    break;
                } else {
                    this.moves[getStr(this.row, c)] = "capturing";
                    break;
                }
            }

            this.moves[getStr(this.row, c)] = "valid";
        }

        for (let c = this.col + 1; c < 8; c++) {
            const piece = board[this.row][c];

            if (piece instanceof ChessPiece) {
                if (piece.color === this.color) {
                    this.protectingMoves[getStr(this.row, c)] = "protecting";
                    break;
                } else {
                    this.moves[getStr(this.row, c)] = "capturing";
                    break;
                }
            }

            this.moves[getStr(this.row, c)] = "valid";
        }

        // go outwards from the current column, i.e iterate through rows
        for (let r = this.row - 1; r >= 0; r--) {
            const piece = board[r][this.col];

            if (piece instanceof ChessPiece) {
                if (piece.color === this.color) {
                    this.protectingMoves[getStr(r, this.col)] = "protecting";
                    break;
                } else {
                    this.moves[getStr(r, this.col)] = "capturing";
                    break;
                }
            }

            this.moves[getStr(r, this.col)] = "valid";
        }

        for (let r = this.row + 1; r < 8; r++) {
            const piece = board[r][this.col];
            if (piece instanceof ChessPiece) {
                if (piece.color === this.color) {
                    this.protectingMoves[getStr(r, this.col)] = "protecting";
                    break;
                } else if (piece.color !== this.color) {
                    this.moves[getStr(r, this.col)] = "capturing";
                    break;
                }
            }

            this.moves[getStr(r, this.col)] = "valid";
        }

        this.checkIfKingInCheck(kingParameters);
        this.handlePiecePinnedByRook(kingParameters, board);
        this.handlePiecePinnedByBishop(kingParameters, board);

        return this.moves;
    };

    setRowCol = (row: number, col: number) => {
        this.row = row;
        this.col = col;
        this.hasMoved = true;
    };
}

export default Rook;
