import React from "react";
import CheckersPiece from "../../classes/checkers/CheckersPiece";
import {
    CheckersBoardType,
    CheckersPieceColor,
} from "../../types/checkersTypes";
import Cell from "../allGames/Cell";

interface RenderChessBoardProps {
    board: CheckersBoardType;
    checkersBoardRef: React.MutableRefObject<HTMLDivElement | null>;
    userPieceColor: CheckersPieceColor;
    testBoard: boolean;
    movePiece: (row: number, col: number) => void;
}

const RenderCheckersBoard: React.FC<RenderChessBoardProps> = ({
    board,
    checkersBoardRef,
    userPieceColor,
    testBoard,
    movePiece,
}) => {
    return (
        <>
            {board.map((row, ri) => (
                <div
                    style={{ margin: 0, padding: 0, display: "flex" }}
                    key={`row${ri}`}
                >
                    {row.map((_col, ci) => {
                        let color = (ri + ci) % 2 === 0 ? "#222f3e" : "#e74c3c";

                        let image = "";
                        let piece = board[ri][ci];
                        let blueDot = false;

                        if (piece instanceof CheckersPiece) {
                            if (piece.color === "white") {
                                if (piece.isKing)
                                    image = "images/checkers/WhiteKing.png";
                                else image = "images/checkers/WhitePiece.png";
                            } else {
                                if (piece.isKing)
                                    image = "images/checkers/RedKing.png";
                                else image = "images/checkers/RedPiece.png";
                            }
                        } else if (piece === "dot") {
                            blueDot = true;
                        }

                        return (
                            <Cell
                                game="checkers"
                                blueDot={blueDot}
                                row={ri}
                                col={ci}
                                color={color}
                                key={`row${ri}-col${ci}`}
                                image={image}
                                showMoves={movePiece}
                                boardRef={checkersBoardRef}
                                userCheckersColor={userPieceColor}
                                testBoard={testBoard}
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
};

export default RenderCheckersBoard;
