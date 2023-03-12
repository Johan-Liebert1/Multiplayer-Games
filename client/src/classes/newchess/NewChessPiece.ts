import { ChessPieceColor, ChessPieceName, MoveType } from "../../types/chessTypes";
import { rowColToCellName } from "./NewChessGame";

export class NewChessPiece {
    color: ChessPieceColor;
    row: number;
    col: number;
    isBeingAttacked: boolean;
    isClicked: boolean;
    pieceName: ChessPieceName;
    image: string;
    moves: Record<MoveType, string[]>;

    constructor(
        color: ChessPieceColor,
        name: ChessPieceName,
        row: number,
        col: number
    ) {
        this.pieceName = name;
        this.color = color;
        this.row = row;
        this.col = col;
        this.isClicked = false;
        this.isBeingAttacked = false;
        this.image = `/images/chess/${color}${
            name[0].toUpperCase() + name.slice(1)
        }.png`;
        this.moves = {
            'valid': [],
            'capturing': [],
            'check-blocking': []
        };
    }


    addMove(moveType: MoveType, row: number, col: number) {
        this.moves[moveType].push(rowColToCellName(row, col));

        if (moveType !== "valid") {
            this.moves["valid"].push(rowColToCellName(row, col));
        }
    }

    rowColWithinBounds(row: number, col: number) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

}
