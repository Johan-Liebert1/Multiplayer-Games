// react stuff
import React, { useState, useEffect, useRef } from "react";

// components
import Cell from "../allGames/Cell";
import GameOverComponent from "../allGames/GameOverComponent";
import PawnPromotionDialog from "./PawnPromotionDialog";

// gameplay
import ChessGame from "../../classes/chess/ChessGame";
import Pawn from "../../classes/chess/Pawn";
import ChessPiece from "../../classes/chess/ChessPiece";

// types
import {
  ChessBoardType,
  ChessPieceColor,
  ChessPieceName,
  ChessWinner
} from "../../types/chessTypes";
import { CheckersPieceColor } from "../../types/checkersTypes";
import { CELL_SIZE, ClickedCellsType } from "../../types/games";
import { RouteProps } from "../../types/routeProps";
import { getNewChessBoard } from "../../helpers/chessHelpers";
import { Button } from "@material-ui/core";
import { axiosInstance } from "../../config/axiosConfig";
import { useTypedSelector } from "../../hooks/useTypedSelector";

const game = new ChessGame();

interface ChessBoardProps extends RouteProps {}

const ChessBoardTest: React.FC<ChessBoardProps> = () => {
  const { user } = useTypedSelector(state => state);

  const [board, setBoard] = useState<ChessBoardType>(() => getNewChessBoard());

  const chessBoardRef = useRef<HTMLDivElement | null>(null);

  const [userPieceColor, setUserPieceColor] = useState<ChessPieceColor>("white");

  const [gameOver, setGameOver] = useState<{
    gameOver: boolean;
    winnerName: string;
    winnerColor: ChessWinner;
  }>({
    gameOver: false,
    winnerName: "",
    winnerColor: "" as ChessPieceColor
  });

  const [showPawnPromotionDialog, setShowPawnPromotionDialog] = useState<{
    show: boolean;
    cellsClicked: ClickedCellsType;
    pawnColor: ChessPieceColor | "";
  }>({
    show: false,
    cellsClicked: {} as ClickedCellsType,
    pawnColor: ""
  });

  useEffect(() => {
    game.setInitiallyAttackedCells(board);
  }, []);

  const handlePawnPromotion = (pieceName: ChessPieceName) => {
    let { cellsClicked } = showPawnPromotionDialog;
    let tempBoard = board.map(b => b);

    // the pawn has been moved at this point
    if (cellsClicked) game.promotePawn(tempBoard, pieceName, cellsClicked);

    setBoard(tempBoard);

    setShowPawnPromotionDialog({
      show: false,
      cellsClicked: {} as ClickedCellsType,
      pawnColor: ""
    });
  };

  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let returnedValue = game.showValidMoves(userPieceColor, tempBoard, row, col);

      if (returnedValue) {
        if ("cellsClicked" in returnedValue) {
          setUserPieceColor(c => (c === "white" ? "black" : "white"));

          const { cellsClicked, pawnPromoted } = returnedValue;

          if (pawnPromoted) {
            // the pawn has reached the other end of the board
            // but hasn't yet been protomted and is still just a pawn
            const pawn = tempBoard[cellsClicked.rows[1]][cellsClicked.cols[1]] as Pawn;

            setShowPawnPromotionDialog({
              show: true,
              cellsClicked,
              pawnColor: pawn.color
            });
          }
        }
      }

      setBoard(tempBoard);

      if (game.isGameOver(board)) {
        let newGameOverObject = {
          gameOver: true,
          winnerColor: game.winner,
          winnerName: game.winner
        };

        setGameOver(newGameOverObject);
      }
    }
  };

  const showChessBoard = () => {
    return board.map((row, ri) => {
      return (
        <div
          style={{
            margin: 0,
            padding: 0,
            display: "flex"
          }}
          key={`row${ri}`}
        >
          {row.map((col, ci) => {
            let color =
              (ri + ci) % 2 !== 0 ? "rgba(195,105,56,0)" : "rgba(239, 206,163,0)";

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
                boardRef={chessBoardRef}
                showMoves={showMoves}
                userChessColor={userPieceColor}
                testBoard
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div style={{ margin: "2rem 4rem" }}>
      <div
        id="checkersBoard"
        style={{
          position: "relative",
          background: "url(/images/chess/chessBoard.jpg)",
          objectFit: "contain",
          backgroundSize: `${CELL_SIZE * board.length}px, ${CELL_SIZE * board.length}px`,
          width: `${CELL_SIZE * board.length}px`,
          height: `${CELL_SIZE * board.length}px`
        }}
        ref={chessBoardRef}
      >
        {gameOver.gameOver && (
          <GameOverComponent
            winnerColor={gameOver.winnerColor as ChessPieceColor | CheckersPieceColor}
            winnerName={gameOver.winnerName}
          />
        )}

        {showPawnPromotionDialog.show && (
          <PawnPromotionDialog
            pawnColor={showPawnPromotionDialog.pawnColor as ChessPieceColor}
            handlePawnPromotion={handlePawnPromotion}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: userPieceColor === "white" ? "column" : "column"
          }}
        >
          {showChessBoard()}
        </div>
      </div>
      <div style={{ height: "2rem", padding: "0.5rem 0" }}>
        <Button
          variant="contained"
          color="default"
          onClick={() => {
            const data = JSON.stringify({
              player1: user.username,
              player2: "Johan",
              moves: game.allGameMoves
            });
            console.log(data);
            axiosInstance
              .post("/games/chess/savegame", data, {
                headers: {
                  "content-type": "application/json"
                }
              })
              .then(resp => {
                console.log(resp.data);
              });
          }}
        >
          save game
        </Button>
      </div>
    </div>
  );
};

export default ChessBoardTest;
