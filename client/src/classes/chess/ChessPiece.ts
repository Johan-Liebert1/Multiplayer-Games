import { getStr } from "../../helpers/globalHelpers";
import {
    ChessBoardType,
    ChessPieceColor,
    ChessPieceName,
    GenericKingParametersType,
    KingParametersType,
    PiecePosition,
    ProtectingChessMove,
    ValidChessMove,
} from "../../types/chessTypes";

class ChessPiece {
    color: ChessPieceColor;
    row: number;
    col: number;
    moves: ValidChessMove;
    protectingMoves: ProtectingChessMove;
    isBeingAttacked: boolean;
    isClicked: boolean;
    pieceName: ChessPieceName;
    image: string;
    isKing: boolean;

    constructor(color: ChessPieceColor, row: number, col: number) {
        this.color = color;
        this.row = row;
        this.col = col;
        this.moves = {};
        this.protectingMoves = {};
        this.isBeingAttacked = false;
        this.isClicked = false;
        this.pieceName = "pawn";
        this.image = "";
        this.isKing = false;
        this.setRowCol(row, col);
    }

    validMoves = (board: ChessBoardType, kingParameters: KingParametersType) =>
        ({} as ValidChessMove);

    getCellsBetweenPieces = (kingPos: PiecePosition) => ({});

    checkIfKingInCheck = (kingParameters: KingParametersType) => {
        let { whiteKingInCheck, blackKingInCheck } = kingParameters;

        if (this.color === "white" && whiteKingInCheck) {
            let { whiteKingPos, pieceCheckingWhiteKing } = kingParameters;
            this.moves = this.handleKingInCheck({
                kingPos: whiteKingPos,
                pieceCheckingKing: pieceCheckingWhiteKing,
            });
        }

        if (this.color === "black" && blackKingInCheck) {
            let { blackKingPos, pieceCheckingBlackKing } = kingParameters;
            this.moves = this.handleKingInCheck({
                kingPos: blackKingPos,
                pieceCheckingKing: pieceCheckingBlackKing,
            });
        }
    };

    handleKingInCheck = (kingParameters: GenericKingParametersType) => {
        // the king of the same color is in check
        let { kingPos, pieceCheckingKing } = kingParameters;
        let newValidMoves: ValidChessMove = {};

        // handle king is being checked by every piece except the king
        if (
            pieceCheckingKing &&
            (pieceCheckingKing.pieceName === "knight" ||
                pieceCheckingKing.pieceName === "pawn")
        ) {
            // only way to escape a Knight's or a Pawn's check is to either move the king,
            // or to capture the Knight or Pawn
            if (
                !(
                    getStr(pieceCheckingKing.row, pieceCheckingKing.col) in
                    this.moves
                )
            ) {
                return {};
            } else {
                let move = getStr(pieceCheckingKing.row, pieceCheckingKing.col);
                newValidMoves[move] = "capturing";
                return newValidMoves;
            }
        }

        if (pieceCheckingKing) {
            // get the cells between the king and the piece checking the king
            // this way we can check if a move exists that blocks the check
            const cellsBetweenPieces =
                pieceCheckingKing.getCellsBetweenPieces(kingPos);

            if (this.pieceName === "king") {
                // console.log("inside if ");
                // if it is the king then it has to move
                console.log("king moves = ", this.moves);
                Object.keys(this.moves).forEach((key) => {
                    if (!(key in cellsBetweenPieces)) {
                        // if the move is not a check blocking move
                        // as the king cannot move to a square that's under attack
                        newValidMoves[key] = "valid";
                    }

                    // can only capture with the king if the piece being captured is not
                    // being protected by one of it's own pieces
                    if (
                        key ===
                        getStr(
                            (pieceCheckingKing as ChessPiece).row,
                            (pieceCheckingKing as ChessPiece).col
                        )
                    ) {
                        newValidMoves[key] = "capturing";
                    }
                });
            } else {
                // if it's not the king then it can block the check
                //console.log("inside else");
                Object.keys(this.moves).forEach((key) => {
                    if (key in cellsBetweenPieces) {
                        // try to implement piece being pinned here

                        newValidMoves[key] = "valid";
                    }
                    if (
                        key ===
                        getStr(
                            (pieceCheckingKing as ChessPiece).row,
                            (pieceCheckingKing as ChessPiece).col
                        )
                    ) {
                        newValidMoves[key] = "capturing";
                    }
                });
            }
        }

        return newValidMoves;
    };

    handlePiecePinnedByRook = (
        kingParameters: KingParametersType,
        board: ChessBoardType
    ) => {
        let newValidMoves: ValidChessMove = {};

        let { blackKingPos, whiteKingPos } = kingParameters;

        let kingPos: [number, number];
        const oppColor = this.color === "white" ? "black" : "white";

        if (this.color === "black") {
            kingPos = blackKingPos;
        } else {
            kingPos = whiteKingPos;
        }

        if (this.row !== kingPos[0] || this.col !== kingPos[1]) return;
        else if (this.row === kingPos[0]) {
            // piece and king are on the same row
            let colAdder = 0,
                isPinned = false;

            // if king is to the left, check the right and vice versa
            if (kingPos[1] < this.col) colAdder = 1;
            else if (kingPos[1] > this.col) colAdder = -1;

            // iterate through the row to find if piece is pinned
            let column = this.col + colAdder;
            while (column > -1 && column < 8) {
                let piece = board[this.row][column];

                if (
                    piece instanceof ChessPiece &&
                    (piece.pieceName === "rook" || piece.pieceName === "queen")
                ) {
                    if (piece.color === oppColor) {
                        isPinned = true;
                    }
                }

                column += colAdder;
            }

            if (isPinned) {
                Object.keys(this.moves).forEach((move) => {
                    // only add the move the new moves if the move is on the
                    // same row
                    if (Number(move.split(",")[0]) === this.row) {
                        newValidMoves[move] = this.moves[move];
                    }
                });
                this.moves = newValidMoves;
            }
        } else if (this.col === kingPos[1]) {
            // piece and king are on the same col
            let rowAdder = 0,
                isPinned = false;

            // if king is to the left, check the right and vice versa
            if (kingPos[0] < this.row) rowAdder = 1;
            else if (kingPos[0] > this.row) rowAdder = -1;

            // iterate through the row to find if piece is pinned
            let row = this.row + rowAdder;
            while (row > -1 && row < 8) {
                let piece = board[row][this.col];

                if (
                    piece instanceof ChessPiece &&
                    (piece.pieceName === "rook" || piece.pieceName === "queen")
                ) {
                    if (piece.color === oppColor) {
                        isPinned = true;
                    }
                }

                row += rowAdder;
            }

            if (isPinned) {
                Object.keys(this.moves).forEach((move) => {
                    // only add the move the new moves if the move is on the
                    // same column
                    if (Number(move.split(",")[1]) === this.col) {
                        newValidMoves[move] = this.moves[move];
                    }
                });

                this.moves = newValidMoves;
            }
        }
    };

    handlePiecePinnedByBishop = (
        kingParameters: KingParametersType,
        board: ChessBoardType
    ) => {
        let newValidMoves: ValidChessMove = {};

        let { blackKingPos, whiteKingPos } = kingParameters;

        let kingPos;
        const oppColor = this.color === "white" ? "black" : "white";

        if (this.color === "black") {
            kingPos = blackKingPos;
        } else {
            kingPos = whiteKingPos;
        }

        // check if piece and king are on the same diagonal
        if (Math.abs(this.row - kingPos[0]) !== Math.abs(this.col - kingPos[1]))
            return;

        let rowAdder = 0,
            colAdder = 0;
        let [kingRow, kingCol] = kingPos;

        // upper left king, go lower right
        if (kingRow < this.row && kingCol < this.col) {
            rowAdder = 1;
            colAdder = 1;
        } else if (kingRow < this.row && kingCol > this.col) {
            // upper right king, go lower left
            rowAdder = 1;
            colAdder = -1;
        } else if (kingRow > this.row && kingCol < this.col) {
            // lower left king, go upper right
            rowAdder = -1;
            colAdder = 1;
        } else if (kingRow > this.row && kingCol > this.col) {
            // lower right king, go upper left
            rowAdder = -1;
            colAdder = -1;
        }

        let row = this.row + rowAdder;
        let col = this.col + colAdder;
        let isPinned = false;
        let pinningPiece: ChessPiece | null = null;

        while (row > -1 && row < 8 && col > -1 && col < 8) {
            let piece = board[row][col];
            if (piece instanceof ChessPiece && piece.color === oppColor) {
                if (
                    piece.pieceName === "bishop" ||
                    piece.pieceName === "queen"
                ) {
                    isPinned = true;
                    pinningPiece = piece;
                }
            }

            row += rowAdder;
            col += colAdder;
        }

        if (isPinned && pinningPiece) {
            // only moves allowed is on the same diagonal that the piece and
            // king are on

            const cellsBetweenKingAndPinningPiece =
                pinningPiece.getCellsBetweenPieces(kingPos);

            Object.keys(this.moves).forEach((move) => {
                if (move in cellsBetweenKingAndPinningPiece) {
                    // on the same diagonal as the king, but
                    // not necessarily on the same diagonal as the king
                    // and the piece

                    newValidMoves[move] = this.moves[move];
                }

                if (
                    move ===
                    getStr(
                        (pinningPiece as ChessPiece).row,
                        (pinningPiece as ChessPiece).col
                    )
                ) {
                    newValidMoves[move] = this.moves[move];
                }
            });

            this.moves = newValidMoves;
        }
    };

    setRowCol = (row: number, col: number) => {
        this.row = row;
        this.col = col;
    };

    resetMoves = () => {
        this.moves = {};
        this.protectingMoves = {};
    };
}

export default ChessPiece;
