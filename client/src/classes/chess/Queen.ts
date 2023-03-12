import Bishop from "./Bishop";
import Rook from "./Rook";
import Piece from "./ChessPiece";
import {
    ChessBoardType,
    ChessPieceColor,
    KingParametersType,
    PiecePosition,
} from "../../types/chessTypes";

class Queen extends Piece {
    rook: Rook;
    bishop: Bishop;

    constructor(color: ChessPieceColor, row: number, col: number) {
        super(color, row, col);
        this.pieceName = "queen";
        this.rook = new Rook(this.color, this.row, this.col);
        this.bishop = new Bishop(this.color, this.row, this.col);
        this.image = `images/chess/${this.color}Queen.png`;
    }

    getCellsBetweenPieces = (kingPos: PiecePosition) => {
        const rooks = this.rook.getCellsBetweenPieces(kingPos);
        const bishops = this.bishop.getCellsBetweenPieces(kingPos);

        return { ...rooks, ...bishops };
    };

    validMoves = (
        board: ChessBoardType,
        kingParameters: KingParametersType
    ) => {
        this.resetMoves();

        const rm = this.rook.validMoves(board, kingParameters);
        const bm = this.bishop.validMoves(board, kingParameters);

        this.moves = { ...rm, ...bm };

        this.protectingMoves = {
            ...this.rook.protectingMoves,
            ...this.bishop.protectingMoves,
        };

        // don't have to do this.checkIfKingInCheck as rook and bishop take care of that
        return this.moves;
    };

    setRowCol = (row: number, col: number) => {
        this.row = row;
        this.rook.row = row;
        this.bishop.row = row;

        this.col = col;
        this.rook.col = col;
        this.bishop.col = col;
    };

    display() {
        return this.color[0].toUpperCase() + "Q";
    }
}

export default Queen;
