// react stuff
import React, { useState, useEffect, useRef } from "react";

// components
import GameOverComponent from "../allGames/GameOverComponent";
import Cell from "../allGames/Cell";

// checkers
import CheckersPiece from "../../classes/checkers/CheckersPiece";
import CheckersGame from "../../classes/checkers/CheckersGame";

// types
import { CheckersBoardType, CheckersPieceColor } from "../../types/checkersTypes";
import { RouteProps } from "../../types/routeProps";
import { getNewCheckersBoard } from "../../helpers/checkersBoard";
import RenderCheckersBoard from "./RenderCheckersBoard";

const game = new CheckersGame();

interface CheckersBoardProps extends RouteProps {}

interface GameOverState {
  gameOver: boolean;
  winnerName: string;
  winnerColor: CheckersPieceColor;
}

const CheckersTestBoard: React.FC<CheckersBoardProps> = () => {
  const [board, setBoard] = useState<CheckersBoardType>(() => getNewCheckersBoard());

  const [gameOver, setGameOver] = useState<GameOverState>({
    gameOver: false,
    winnerName: "",
    winnerColor: "" as CheckersPieceColor
  });

  let [userPieceColor, setUserPieceColor] = useState<CheckersPieceColor>("white");

  const checkersBoardRef = useRef<HTMLDivElement | null>(null);

  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let cellsClicked = game.showValidMoves(userPieceColor, tempBoard, row, col);
      setBoard(tempBoard);

      if (cellsClicked && cellsClicked.rows.length === 2) {
        setUserPieceColor(c => (c === "red" ? "white" : "red"));

        let isGameOver = game.isGameOver(board);

        if (isGameOver) {
          let newGameOverObject = {
            gameOver: true,
            winnerColor: game.winner as CheckersPieceColor,
            winnerName: game.winner as string
          };

          setGameOver(newGameOverObject);
        }
      }
    }
  };

  return (
    <div style={{ marginLeft: "4rem" }}>
      <div id="checkersBoard" style={{ position: "relative" }}>
        {gameOver.gameOver && (
          <GameOverComponent
            winnerColor={gameOver.winnerColor}
            winnerName={gameOver.winnerName}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: userPieceColor === "white" ? "column" : "column"
          }}
          ref={checkersBoardRef}
        >
          <RenderCheckersBoard
            board={board}
            checkersBoardRef={checkersBoardRef}
            userPieceColor={userPieceColor}
            testBoard={true}
            movePiece={showMoves}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckersTestBoard;
