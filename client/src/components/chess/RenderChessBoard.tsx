import React from "react";

import Cell from "../allGames/Cell";

import { ChessBoardType, ChessPieceColor } from "../../types/chessTypes";
import ChessPiece from "../../classes/chess/ChessPiece";
import { NewChessGame } from "../../classes/newchess/NewChessGame";
import { NewChessPiece } from "../../classes/newchess/NewChessPiece";
import { rowColToCellName } from "../../classes/newchess/helpers";

interface RenderChessBoardProps {
    board: ChessBoardType | NewChessGame["board"];
    chessBoardRef?: React.MutableRefObject<HTMLDivElement | null>;
    userPieceColor: ChessPieceColor;
    testBoard: boolean;
    movePiece: (row: number, col: number) => void;
    dots?: string[];
}

const RenderChessBoard: React.FC<RenderChessBoardProps> = ({
    board,
    chessBoardRef,
    userPieceColor,
    testBoard,
    movePiece,
    dots
}) => {
    return (
        <>
            {board.map((row, rIndex) => {
                const ri = 7 - rIndex;
                return (
                    <div
                        style={{
                            margin: 0,
                            padding: 0,
                            display: "flex",
                        }}
                        key={`row${ri}`}
                    >
                        {row.map((_, ci) => {
                            let color =
                                (ri + ci) % 2 !== 0
                                    ? "rgba(195,105,56)"
                                    : "rgba(239, 206,163)";

                            const piece = board[ri][ci];
                            let blueDot = false,
                                redDot,
                                isClicked;

                            if (dots && dots.includes(rowColToCellName(ri, ci))) {
                                blueDot = true;
                            }

                            if (piece === "dot") {
                                blueDot = true;
                            }

                            if (
                                piece instanceof ChessPiece ||
                                piece instanceof NewChessPiece
                            ) {
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
                                        piece instanceof ChessPiece ||
                                        piece instanceof NewChessPiece
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
