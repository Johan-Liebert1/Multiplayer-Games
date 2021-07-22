import React, { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";

import Cell from "./Cell";

import ChessGame from "../classes/chess/ChessGame";

import Pawn from "../classes/chess/Pawn";
import Rook from "../classes/chess/Rook";
import Knight from "../classes/chess/Knight";
import Bishop from "../classes/chess/Bishop";
import King from "../classes/chess/King";
import Queen from "../classes/chess/Queen";
import ChessPiece from "../classes/chess/ChessPiece";

import { ChessBoardType, ChessPieceColor, ChessPieceName } from "../types/chessTypes";

const game = new ChessGame();

const ChessBoard: React.FC = () => {
  const [board, setBoard] = useState<ChessBoardType>([
    [
      new Rook("black", 0, 0),
      new Knight("black", 0, 1),
      new Bishop("black", 0, 2),
      new Queen("black", 0, 3),
      new King("black", 0, 4),
      new Bishop("black", 0, 5),
      new Knight("black", 0, 6),
      new Rook("black", 0, 7)
    ],
    [
      new Pawn("black", 1, 0),
      new Pawn("black", 1, 1),
      new Pawn("black", 1, 2),
      new Pawn("black", 1, 3),
      new Pawn("black", 1, 4),
      new Pawn("black", 1, 5),
      new Pawn("black", 1, 6),
      new Pawn("black", 1, 7)
    ],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [
      new Pawn("white", 6, 0),
      new Pawn("white", 6, 1),
      new Pawn("white", 6, 2),
      new Pawn("white", 6, 3),
      new Pawn("white", 6, 4),
      new Pawn("white", 6, 5),
      new Pawn("white", 6, 6),
      new Pawn("white", 6, 7)
    ],
    [
      new Rook("white", 7, 0),
      new Knight("white", 7, 1),
      new Bishop("white", 7, 2),
      new Queen("white", 7, 3),
      new King("white", 7, 4),
      new Bishop("white", 7, 5),
      new Knight("white", 7, 6),
      new Rook("white", 7, 7)
    ]
  ]);

  const windowSize = useWindowSize();

  const [gameOver, setGameOver] = useState({
    gameOver: false,
    winnerName: null,
    winnerColor: null
  });

  const [showPawnPromotionDialog, setShowPawnPromotionDialog] = useState({
    show: false,
    cellsClicked: null,
    pawnColor: null
  });

  useEffect(() => {
    game.setInitiallyAttackedCells(board);
  }, []);

  const handlePawnPromotion = (pieceName: ChessPieceName) => {
    let { cellsClicked } = showPawnPromotionDialog;
    let tempBoard = board.map(b => b);

    // socket.emit("pawnPromoted", { pieceName, cellsClicked });

    // the pawn has been moved at this point
    // if (cellsClicked) game.promotePawn(tempBoard, pieceName, cellsClicked);

    setBoard(tempBoard);

    setShowPawnPromotionDialog({ show: false, cellsClicked: null, pawnColor: null });
  };

  const [chessPieceColor, setChessPieceColor] = useState<ChessPieceColor>("white");

  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let returnedValue = game.showValidMoves(chessPieceColor, tempBoard, row, col);
      setBoard(tempBoard);

      if (returnedValue) {
        setChessPieceColor("black");
      }
    }
  };

  const showChessBoard = () => {
    return board.map((row, ri) => {
      return (
        <div style={{ margin: 0, padding: 0, display: "flex" }} key={`row${ri}`}>
          {row.map((col, ci) => {
            let color = (ri + ci) % 2 !== 0 ? "rgb(195,105,56)" : "rgb(239, 206,163)";

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
                image={piece instanceof ChessPiece ? piece.image : ""}
                showMoves={showMoves}
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div style={{ margin: windowSize[0] < 910 ? "2rem 0" : "" }}>
      <div style={{ height: "2rem" }}></div>

      <div id="checkersBoard" style={{ position: "relative" }}>
        {/* {gameOver.gameOver && (
          <GameOverComponent
            winnerColor={gameOver.winnerColor}
            winnerName={gameOver.winnerName}
          />
        )}

        {showPawnPromotionDialog.show && (
          <PawnPromotionDialog
            pawnColor={showPawnPromotionDialog.pawnColor}
            handlePawnPromotion={handlePawnPromotion}
          />
        )} */}
        <div
          style={{
            display: "flex",
            flexDirection: chessPieceColor === "white" ? "column" : "column-reverse"
          }}
        >
          {showChessBoard()}
        </div>
      </div>
      <div style={{ height: "2rem", padding: "0.5rem 0" }}>
        {/* <h3>{getPlayerName("self")}</h3> */}
      </div>
    </div>
  );
};

export default ChessBoard;
