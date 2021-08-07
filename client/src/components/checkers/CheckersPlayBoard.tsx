// react stuff
import React, { useState, useEffect, useRef } from "react";

// components
import GameOverComponent from "../allGames/GameOverComponent";
import RenderCheckersBoard from "./RenderCheckersBoard";

// checkers
import CheckersGame from "../../classes/checkers/CheckersGame";

// types
import { CheckersBoardType, CheckersPieceColor } from "../../types/checkersTypes";
import { RouteProps } from "../../types/routeProps";
import { getNewCheckersBoard } from "../../helpers/checkersBoard";
import { axiosInstance } from "../../config/axiosConfig";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { getCheckersMovesFromString } from "../../helpers/globalHelpers";
import { Button } from "@material-ui/core";

let game = new CheckersGame();

interface CheckersBoardProps extends RouteProps {}

interface GameOverState {
  gameOver: boolean;
  winnerName: string;
  winnerColor: CheckersPieceColor;
}

const CheckersPlayBoard: React.FC<CheckersBoardProps> = () => {
  const { user } = useTypedSelector(state => state);

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

      if (cellsClicked?.cols.length === 2) {
        setUserPieceColor(c => (c === "white" ? "red" : "white"));
      }

      let isGameOver = game.isGameOver(board);

      if (isGameOver) {
        const winnerName = game.winner === userPieceColor ? user.username : "player2Name";

        let newGameOverObject = {
          gameOver: true,
          winnerColor: game.winner as CheckersPieceColor,
          winnerName
        };

        setGameOver(newGameOverObject);
      }
    }
  };

  return (
    <div style={{ marginLeft: "4rem", display: "flex" }}>
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
        <Button
          variant="contained"
          onClick={() => {
            const data = JSON.stringify({
              player1: user.username,
              player2: "Johan",
              moves: game.getAllMoves()
            });

            console.log(data);

            axiosInstance
              .post("/games/checkers/savegame", data, {
                headers: { Authorization: `Bearer ${user.token}` }
              })
              .then(resp => console.log(resp.data));
          }}
        >
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default CheckersPlayBoard;
