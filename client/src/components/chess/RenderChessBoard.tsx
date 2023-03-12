import React from "react";

import Cell from "../allGames/Cell";

import { ChessBoardType, ChessPieceColor } from "../../types/chessTypes";
import ChessPiece from "../../classes/chess/ChessPiece";

interface RenderChessBoardProps {
    board: ChessBoardType;
    chessBoardRef: React.MutableRefObject<HTMLDivElement | null>;
    userPieceColor: ChessPieceColor;
    testBoard: boolean;
    movePiece: (row: number, col: number) => void;
}

const RenderChessBoard: React.FC<RenderChessBoardProps> = ({
    board,
    chessBoardRef,
    userPieceColor,
    testBoard,
    movePiece,
}) => {
    return (
        <>
            {board.map((row, ri) => {
                return (
                    <div
                        style={{
                            margin: 0,
                            padding: 0,
                            display: "flex",
                        }}
                        key={`row${ri}`}
                    >
                        {row.map((col, ci) => {
                            let color =
                                (ri + ci) % 2 !== 0
                                    ? "rgba(195,105,56,0)"
                                    : "rgba(239, 206,163,0)";

                            let piece = board[ri][ci];
                            let blueDot = false,
                                redDot,
                                isClicked;

                            if (piece === "dot") {
                                blueDot = true;
                            }

                            if (piece instanceof ChessPiece) {
                                if (piece.isBeingAttacked) {
                                    redDot = true;
                                }

                                if (piece.isClicked) {
                                    isClicked = true;
                                }
                            }

                            return (
                                <Cell
                                    game="chess"
                                    blueDot={blueDot}
                                    redDot={redDot}
                                    isClicked={isClicked}
                                    row={ri}
                                    col={ci}
                                    color={color}
                                    key={`row${ri}-col${ci}`}
                                    image={
                                        piece instanceof ChessPiece
                                            ? piece.image
                                            : ""
                                    }
                                    boardRef={chessBoardRef}
                                    showMoves={movePiece}
                                    userChessColor={userPieceColor}
                                    testBoard={testBoard}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
};

export default RenderChessBoard;
