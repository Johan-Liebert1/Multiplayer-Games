import { pieceNamesToLetter } from "../../helpers/chessHelpers";
import { getStr } from "../../helpers/globalHelpers";
import {
    CellsUnderAttack,
    ChessBoardType,
    ChessDrawType,
    ChessPieceColor,
    ChessPieceName,
    ChessWinner,
    InvalidChessMove,
    KingParametersType,
    MovePieceReturnType,
    PiecePosition,
    PotentialCapturingMove,
    ProtectingChessMove,
    ShowValidMovesReturnType,
    ValidChessMove,
    waysToDraw,
} from "../../types/chessTypes";
import { ClickedCellsType } from "../../types/games";
import Bishop from "./Bishop";
import ChessPiece from "./ChessPiece";
import King from "./King";
import Knight from "./Knight";
import Pawn from "./Pawn";
import Queen from "./Queen";
import Rook from "./Rook";

class ChessGame {
    turn: ChessPieceColor;
    cellsClicked: ClickedCellsType;
    numClicks: number;
    selected: ChessPiece | null;

    blackKingInCheck: boolean;
    whiteKingInCheck: boolean;
    pieceCheckingWhiteKing: ChessPiece | null;
    pieceCheckingBlackKing: ChessPiece | null;
    whiteKingPos: PiecePosition;
    blackKingPos: PiecePosition;
    cellsUnderAttackByWhite: CellsUnderAttack;
    cellsUnderAttackByBlack: CellsUnderAttack;

    kingParams: KingParametersType;

    gameOver: boolean;
    winner: ChessWinner;

    piecePoints: { [key in ChessPieceName]: number };

    whitePiecesValue: number;
    blackPiecesValue: number;

    whitePiecesOnBoard: { [key in ChessPieceName]: number };
    blackPiecesOnBoard: { [key in ChessPieceName]: number };

    allGameMoves: ClickedCellsType[];
    pgn: { [k: number]: string };
    movesString: string;

    constructor(
        turn: ChessPieceColor = "white",
        whiteKingPos: PiecePosition = [7, 4],
        blackKingPos: PiecePosition = [0, 4]
    ) {
        this.turn = turn;

        this.cellsClicked = { rows: [], cols: [] };
        this.numClicks = 0;
        this.selected = null;

        this.whiteKingPos = whiteKingPos;
        this.blackKingPos = blackKingPos;
        this.whiteKingInCheck = false;
        this.blackKingInCheck = false;
        this.pieceCheckingWhiteKing = null;
        this.pieceCheckingBlackKing = null;

        this.kingParams = {} as KingParametersType;

        this.gameOver = false;
        this.winner = "";
        this.whitePiecesOnBoard = this.initialPieces();
        this.blackPiecesOnBoard = this.initialPieces();
        this.piecePoints = {
            king: 0,
            queen: 9,
            knight: 3,
            bishop: 3,
            rook: 5,
            pawn: 1,
        };
        this.whitePiecesValue = 0;
        this.blackPiecesValue = 0;

        // key = row,col of the piece
        // value = piece.validMoves()
        this.cellsUnderAttackByWhite = {};
        this.cellsUnderAttackByBlack = {};

        this.allGameMoves = [];
        this.pgn = {};
        this.movesString = "";

        this.setKingParams();
    }

    initialPieces = () => {
        return {
            king: 1,
            queen: 1,
            knight: 2,
            bishop: 2,
            rook: 2,
            pawn: 8,
        };
    };

    /*
    parameters to pass to validmoves function
    0. Board
    1. need to pass if kings are in check.
    2. position of the kings.
    3. piece that is chekcing the king.
    */

    setKingParams = () => {
        this.kingParams = {
            whiteKingInCheck: this.whiteKingInCheck,
            blackKingInCheck: this.blackKingInCheck,
            whiteKingPos: this.whiteKingPos,
            blackKingPos: this.blackKingPos,
            pieceCheckingWhiteKing: this.pieceCheckingWhiteKing,
            pieceCheckingBlackKing: this.pieceCheckingBlackKing,
            cellsUnderAttackByWhite: this.cellsUnderAttackByWhite,
            cellsUnderAttackByBlack: this.cellsUnderAttackByBlack,
        };
    };

    clearDots = (board: ChessBoardType) => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                const piece = board[row][col];

                if (piece === "dot") {
                    board[row][col] = 0;
                }

                if (piece instanceof ChessPiece) {
                    if (piece.isBeingAttacked) {
                        piece.isBeingAttacked = false;
                    }

                    if (piece.isClicked) {
                        piece.isClicked = false;
                    }
                }
            }
        }
    };

    showDots = (board: ChessBoardType, moves: ValidChessMove) => {
        //	console.log(moves);
        Object.keys(moves).forEach((key) => {
            // key = row,col
            const [row, col] = key.split(",").map((k) => Number(k));

            if (moves[key] === "valid") {
                board[row][col] = "dot";
            } else if (moves[key] === "capturing") {
                (board[row][col] as ChessPiece).isBeingAttacked = true;
            } else if (moves[key] === "castling") {
                board[row][col] = "dot";
            }
        });
    };

    showValidMoves = (
        userColor: ChessPieceColor,
        board: ChessBoardType,
        row: number,
        col: number
    ): ShowValidMovesReturnType => {
        if (
            board[row][col] instanceof ChessPiece &&
            (board[row][col] as ChessPiece).color !== userColor &&
            this.numClicks === 0
        )
            return;

        this.clearDots(board);

        let piece = board[row][col];

        if (piece instanceof ChessPiece) {
            if (piece.color === this.turn) {
                // console.log("calculating piece moves");

                this.showDots(board, piece.validMoves(board, this.kingParams));

                piece.isClicked = true;
            }
        }

        let tempCellsClicked = this.select(board, row, col);

        return tempCellsClicked;
    };

    handlePawnPromotion = (pawn: Pawn) => {
        // use DOM Manupulation to show the component to choose
        // the piece to promote the pawn to
        if (pawn.row === 0 || pawn.row === 7) return true;

        return false;
    };

    changePawnToPiece = (
        board: ChessBoardType,
        promoteTo: ChessPieceName,
        color: ChessPieceColor,
        rowf: number,
        colf: number
    ) => {
        switch (promoteTo) {
            case "queen":
                board[rowf][colf] = new Queen(color, rowf, colf);
                break;

            case "rook":
                board[rowf][colf] = new Rook(color, rowf, colf);
                break;

            case "bishop":
                board[rowf][colf] = new Bishop(color, rowf, colf);
                break;

            case "knight":
                board[rowf][colf] = new Knight(color, rowf, colf);
                break;

            default:
                break;
        }
    };

    promotePawn = (
        board: ChessBoardType,
        promoteTo: ChessPieceName,
        cellsClicked: ClickedCellsType
    ) => {
        // pawn has already been moved but the opponent hasn't seen it

        this.generateMoveString(cellsClicked, {
            promoted: true,
            promotedTo: promoteTo,
        });

        const { rows, cols } = cellsClicked;
        const [rowi, rowf] = rows;
        const [coli, colf] = cols;

        let pawn = board[rowf][colf];

        if (pawn instanceof Pawn) {
            board[rowf][colf] = 0;
            this.changePawnToPiece(board, promoteTo, pawn.color, rowf, colf);
        } else {
            // move the pawn for the opponent to see
            let pawn = board[rowi][coli] as ChessPiece;
            board[rowi][coli] = 0;
            this.changePawnToPiece(board, promoteTo, pawn.color, rowf, colf);
        }

        // if the king was already in check, then set it to false as the current
        // move must've blocked the check
        if (this.whiteKingInCheck) {
            this.whiteKingInCheck = false;
            this.pieceCheckingWhiteKing = null;
        }

        if (this.blackKingInCheck) {
            this.blackKingInCheck = false;
            this.pieceCheckingBlackKing = null;
        }

        this.setKingParams();

        // get moves and protecting moves of the piece after it has moved
        // in order to set the 'attacked' squares
        this.setInitiallyAttackedCells(board);

        this.clearDots(board);
        this.changeTurn();

        this.setKingInCheck(board, this.turn, board[rowf][colf] as ChessPiece);
    };

    setKingInCheck = (
        board: ChessBoardType,
        kingColor: ChessPieceColor,
        lastMovedPiece: ChessPiece
    ) => {
        if (kingColor === "white") {
            let kingPos = getStr(this.whiteKingPos[0], this.whiteKingPos[1]);

            if (kingPos in lastMovedPiece.validMoves(board, this.kingParams)) {
                this.whiteKingInCheck = true;
                this.pieceCheckingWhiteKing = lastMovedPiece;
            }
        } else if (kingColor === "black") {
            let kingPos = getStr(this.blackKingPos[0], this.blackKingPos[1]);

            if (kingPos in lastMovedPiece.validMoves(board, this.kingParams)) {
                // need to set this to false somewhere
                this.blackKingInCheck = true;
                this.pieceCheckingBlackKing = lastMovedPiece;
            }
        }

        if (this.whiteKingInCheck) {
            console.log("this.whiteKingInCheck");
            let [r, c] = this.whiteKingPos;
            (board[r][c] as King).isBeingAttacked = true;
        }

        if (this.blackKingInCheck) {
            console.log("this.blackKingInCheck");

            let [r, c] = this.blackKingPos;
            (board[r][c] as King).isBeingAttacked = true;
        }

        this.setKingParams();
    };

    setInitiallyAttackedCells = (board: ChessBoardType) => {
        this.cellsUnderAttackByBlack = {};
        this.cellsUnderAttackByWhite = {};

        this.whitePiecesOnBoard = this.initialPieces();
        this.blackPiecesOnBoard = this.initialPieces();

        this.whitePiecesValue = 0;
        this.blackPiecesValue = 0;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                console.log("setInitiallyAttackedCells");
                let piece = board[row][col];
                if (piece instanceof ChessPiece) {
                    // console.log("piece instanceof ChessPiece");
                    let str = getStr(piece.row, piece.col);
                    let attackedCells:
                        | ValidChessMove
                        | ProtectingChessMove
                        | InvalidChessMove
                        | PotentialCapturingMove = {};

                    if (piece.color === "white") {
                        if (!(piece.pieceName in this.whitePiecesOnBoard)) {
                            this.whitePiecesOnBoard[piece.pieceName] = 1;
                        } else {
                            this.whitePiecesOnBoard[piece.pieceName] += 1;
                        }
                        this.whitePiecesValue +=
                            this.piecePoints[piece.pieceName];
                    } else if (piece.color === "black") {
                        if (!(piece.pieceName in this.blackPiecesOnBoard)) {
                            this.blackPiecesOnBoard[piece.pieceName] = 1;
                        } else {
                            this.blackPiecesOnBoard[piece.pieceName] += 1;
                        }
                        this.blackPiecesValue +=
                            this.piecePoints[piece.pieceName];
                    }

                    console.log("before getting moves", piece);
                    // this will set piece.moves and piece.protectingMoves
                    if (piece instanceof Pawn) {
                        piece.validMoves(board, this.kingParams, true);
                    } else {
                        piece.validMoves(board, this.kingParams);
                    }
                    console.log("after gettingmoves");

                    let totalMoves:
                        | ValidChessMove
                        | ProtectingChessMove
                        | PotentialCapturingMove = {};

                    if (piece instanceof King) {
                        totalMoves = {
                            ...piece.moves,
                            ...piece.protectingMoves,
                            // ...piece.invalidMoves
                        } as
                            | ValidChessMove
                            | ProtectingChessMove
                            | PotentialCapturingMove;
                    } else if (piece instanceof Pawn) {
                        totalMoves = {
                            ...piece.moves,
                            ...piece.protectingMoves,
                            ...piece.potentialCapturingMoves,
                        } as
                            | ValidChessMove
                            | ProtectingChessMove
                            | PotentialCapturingMove;
                    } else {
                        totalMoves = {
                            ...piece.moves,
                            ...piece.protectingMoves,
                        } as
                            | ValidChessMove
                            | ProtectingChessMove
                            | PotentialCapturingMove;
                    }

                    // console.log("totalMoves = ", totalMoves);
                    Object.keys(totalMoves).forEach((key) => {
                        // console.log("iterating over total moves");

                        const piece = board[row][col];

                        if (piece instanceof Pawn) {
                            // as pawn's valid moves aren't its capturing moves
                            if (totalMoves[key] !== "valid") {
                                attackedCells[key] = totalMoves[key];

                                if (
                                    piece.color === "black" &&
                                    getStr(...this.whiteKingPos) === key
                                ) {
                                    console.log("key = ", key);
                                    console.log(
                                        "getstr(whiteKingPos) = ",
                                        getStr(...this.whiteKingPos)
                                    );
                                    this.whiteKingInCheck = true;
                                    this.pieceCheckingWhiteKing = piece;
                                }

                                if (
                                    piece.color === "white" &&
                                    getStr(...this.blackKingPos) === key
                                ) {
                                    console.log("key = ", key);
                                    console.log(
                                        "getstr(blackKingPos) = ",
                                        getStr(...this.blackKingPos)
                                    );
                                    this.blackKingInCheck = true;
                                    this.pieceCheckingBlackKing = piece;
                                }
                            }
                        } else if (piece instanceof ChessPiece) {
                            attackedCells[key] = totalMoves[key];

                            if (
                                piece.color === "black" &&
                                getStr(...this.whiteKingPos) === key
                            ) {
                                this.whiteKingInCheck = true;
                                this.pieceCheckingWhiteKing = piece;
                            }

                            if (
                                piece.color === "white" &&
                                getStr(...this.blackKingPos) === key
                            ) {
                                this.blackKingInCheck = true;
                                this.pieceCheckingBlackKing = piece;
                            }
                        }
                    });

                    if (piece.color === "white") {
                        // console.log("attackedCells = ", attackedCells);
                        this.cellsUnderAttackByWhite[str] = attackedCells;
                    } else {
                        this.cellsUnderAttackByBlack[str] = attackedCells;
                    }
                }
            }
        }

        this.setKingParams();
        this.isGameOver(board);
    };

    select = (
        board: ChessBoardType,
        row: number,
        col: number
    ): ShowValidMovesReturnType => {
        if (this.numClicks === 0) {
            const cell = board[row][col];

            if (!(cell instanceof ChessPiece)) return;
            else if (cell.color !== this.turn) return;
            else {
                this.cellsClicked.rows.push(row);
                this.cellsClicked.cols.push(col);
                this.numClicks++;
                return this.cellsClicked;
            }
        } else if (this.numClicks === 1) {
            // a piece has already been clicked
            const cell = board[row][col];

            if (cell instanceof ChessPiece) {
                // if player clicked on another piece of his color, do not changeTurn

                if (cell.color === this.turn) {
                    this.cellsClicked.rows[0] = row;
                    this.cellsClicked.cols[0] = col;
                    return this.cellsClicked;
                }
            }

            let str = getStr(row, col);
            let piece =
                board[this.cellsClicked.rows[0]][this.cellsClicked.cols[0]];

            if (!(piece instanceof ChessPiece)) return;

            if (!(str in piece.validMoves(board, this.kingParams))) {
                return;
            }

            // update this.cellsClicked for socket connection
            this.cellsClicked.rows.push(row);
            this.cellsClicked.cols.push(col);

            let tempCellsClicked = this.movePiece(board, this.cellsClicked);

            return tempCellsClicked;
        }
    };

    getAllMoves = () => {
        return this.movesString;
    };

    generateMoveString = (
        clickedCells: ClickedCellsType,
        pawnPromoted?: { promoted: boolean; promotedTo: ChessPieceName }
    ) => {
        const {
            rows: [ri, rf],
            cols: [ci, cf],
        } = clickedCells;

        let moveStr = `${getStr(ri, rf)};${getStr(ci, cf)}`;

        if (!pawnPromoted) {
            this.movesString += `${moveStr}:`;
        } else {
            this.movesString += `${moveStr}=${pawnPromoted.promotedTo}:`;
        }
    };

    /**
     * For generating a PGN, two pieces could make the same move, so this function
     * distinguishes between the pieces and gets the piece that actaully made the move
     */
    similarMoveByAnotherPiece = (clickedCells: ClickedCellsType) => {
        // use cols to indicate the piece
        // if pieces are on same col, use row
        // Nbc4 or N4c4
    };

    generatePgn = (
        clickedCells: ClickedCellsType,
        movedPiece: ChessPieceName,
        moveNumber: number,
        wasPieceCaptured: boolean,
        castling: {
            castled: boolean;
            side: "king" | "queen";
        },
        promotion?: {
            promoted: boolean;
            promotedTo: ChessPieceName;
        }
    ) => {
        let movePgn: string = "";

        if (castling.castled) {
            if (castling.side === "king") movePgn = "O-O";
            else movePgn = "O-O-O";
        } else {
            const {
                rows: [rowi, rowf],
                cols: [coli, colf],
            } = clickedCells;

            // ASCII 'a' = 97
            const colNamef = String.fromCharCode(colf + 97);
            const rowNamef = 7 - rowf + 1;

            const colNamei = String.fromCharCode(coli + 97);
            const rowNamei = 7 - rowi + 1;

            const letter = pieceNamesToLetter[movedPiece];

            let x = "";

            if (wasPieceCaptured) {
                x = "x";

                if (letter.length === 0) {
                    // pawn captured something
                    x = `${colNamei}x`;
                }
            }

            movePgn = `${letter}${x}${colNamef}${rowNamef}`;
        }

        if (!(moveNumber in this.pgn)) {
            this.pgn[moveNumber] = movePgn;
        } else {
            this.pgn[moveNumber] += " " + movePgn;
        }

        // console.log(this.pgn);
    };

    movePiece = (
        board: ChessBoardType,
        clickedCells: ClickedCellsType
    ): MovePieceReturnType => {
        // clicked cells is basically this.cellsClicked, but we take it as a
        // parameter so that we can also use it for sockets
        let castlingDone = false,
            pawnPromoted = false;

        let castleSide: "king" | "queen" = "king";

        let { rows, cols } = clickedCells;

        const [rowi, rowf] = rows;
        const [coli, colf] = cols;

        let piece = board[rowi][coli] as ChessPiece;

        const wasPieceCaptured = board[rowf][colf] instanceof ChessPiece;

        if (piece instanceof King && (colf === coli + 2 || colf === coli - 2)) {
            // castling move played
            this.castleKing(board, clickedCells);
            castlingDone = true;

            if (colf === coli + 2) {
                castleSide = "king";
            } else {
                castleSide = "queen";
            }
        } else {
            // clicked cell is a valid move
            board[rowi][coli] = 0;
            board[rowf][colf] = piece;
        }

        piece.setRowCol(rowf, colf);

        // set the king positions in order to help with checking for 'checks'
        if (piece instanceof King) {
            if (piece.color === "white") {
                this.whiteKingPos = [piece.row, piece.col];
            } else if (piece.color === "black") {
                this.blackKingPos = [piece.row, piece.col];
            }
        }

        // if the king was already in check, then set it to false as the current
        // move must've blocked the check
        if (this.whiteKingInCheck) {
            this.whiteKingInCheck = false;
            this.pieceCheckingWhiteKing = null;
        }

        if (this.blackKingInCheck) {
            this.blackKingInCheck = false;
            this.pieceCheckingBlackKing = null;
        }

        this.setKingParams();

        if (piece instanceof Pawn) {
            pawnPromoted = this.handlePawnPromotion(piece);

            if (pawnPromoted) {
                return {
                    cellsClicked: this.cellsClicked,
                    castlingDone,
                    pawnPromoted,
                };
            }
        }

        // get moves and protecting moves of the piece after it has moved
        // in order to set the 'attacked' squares
        this.setInitiallyAttackedCells(board);

        // this.cellsClicked || clickedCells for moves that come via socket
        let tcc = this.cellsClicked;

        if (tcc.rows.length !== 2) tcc = clickedCells;

        this.clearDots(board);
        this.changeTurn();

        // check if king is in check
        // as the previous move might have been by white, and after movePiece()
        // changes the turn, now it's black's turn and we need to check if
        // black king is in check
        // the piece has moved and it's row and columns have been changed so there
        // is no point in passing the previously calculated moves to this function
        this.setKingInCheck(board, this.turn, piece);

        // add the move to the list of all moves
        this.allGameMoves.push(tcc);

        const moveNumber = Math.ceil(this.allGameMoves.length / 2);

        this.generatePgn(tcc, piece.pieceName, moveNumber, wasPieceCaptured, {
            castled: castlingDone,
            side: castleSide,
        });

        this.generateMoveString(tcc);

        return { cellsClicked: tcc, castlingDone, pawnPromoted };
    };

    castleKing = (board: ChessBoardType, clickedCells: ClickedCellsType) => {
        let { rows, cols } = clickedCells;

        const [rowi, rowf] = rows;
        const [coli, colf] = cols;

        const king = board[rowi][coli];

        // if colf < coli, then king was moved left
        // colf > coli = king side castling, i.e castling right
        // colf < coli = queen side castling, i.e. castling left
        const rookCol = colf < coli ? 0 : 7;
        const colAdder = colf < coli ? 1 : -1;

        let rook = board[rowi][rookCol];

        if (rook instanceof Rook) {
            // move the king
            board[rowf][colf] = king;
            board[rowi][coli] = 0;

            // move the rook to the right of the king
            board[rowf][colf + colAdder] = rook;
            board[rowi][rookCol] = 0;

            rook.setRowCol(rowf, colf + colAdder);
        }
    };

    colorHasMovesLeft = (board: ChessBoardType, color: ChessPieceColor) => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                const piece = board[row][col];
                if (piece instanceof ChessPiece && piece.color === color) {
                    const validMoves = piece.validMoves(board, this.kingParams);
                    piece.pieceName === "king" &&
                        console.log(
                            piece.color + " " + piece.pieceName,
                            validMoves
                        );
                    if (Object.keys(validMoves).length > 0) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    blackWins = () => {
        this.gameOver = true;
        this.winner = "black";
        return this.gameOver;
    };

    whiteWins = () => {
        this.gameOver = true;
        this.winner = "white";
        return this.gameOver;
    };

    draw = (how: ChessDrawType) => {
        this.gameOver = true;
        this.winner = `Draw by ${how}`;
        return this.gameOver;
    };

    isGameOver = (board: ChessBoardType) => {
        if (this.whitePiecesValue === 0 || this.whitePiecesValue === 3) {
            if (this.blackPiecesValue === 0 || this.blackPiecesValue === 3) {
                // only two kings are left on board, or a king and bishop/knight left
                return this.draw(waysToDraw.INSUFFICIENT_PIECES);
            }
        }

        if (this.blackPiecesValue === 0 || this.blackPiecesValue === 3) {
            if (this.whitePiecesValue === 0 || this.whitePiecesValue === 3) {
                // only two kings are left on board, or a king and bishop/knight left
                return this.draw(waysToDraw.INSUFFICIENT_PIECES);
            }
        }

        if (!this.colorHasMovesLeft(board, "white")) {
            console.log("no white moves left");
            if (this.whiteKingInCheck) {
                return this.blackWins();
            } else {
                return this.draw(waysToDraw.STALEMATE);
            }
        }

        if (!this.colorHasMovesLeft(board, "black")) {
            console.log("no black moves left");

            if (this.blackKingInCheck) {
                return this.whiteWins();
            } else {
                return this.draw(waysToDraw.STALEMATE);
            }
        }

        return false;
    };

    changeTurn = () => {
        this.cellsClicked = { rows: [], cols: [] };
        this.numClicks = 0;

        this.turn = this.turn === "white" ? "black" : "white";
    };
}

export default ChessGame;
