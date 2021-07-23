// react stuff
import React, { useState, useEffect } from "react";
import Cell from "./Cell";

// components
import GameOverComponent from "./GameOverComponent";

// checkers
import CheckersPiece from "../classes/checkers/CheckersPiece";
import CheckersGame from "../classes/checkers/CheckersGame";

// sockets
import { io, Socket } from "socket.io-client";

// types
import { ClickedCellsType } from "../types/games";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { socketEmitEvents, socketListenEvents } from "../types/socketEvents";
import { CheckersBoardType, CheckersPieceColor } from "../types/checkersTypes";

const game = new CheckersGame();
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

interface CheckersBoardProps {
  roomId: string;
}

const CheckersBoard: React.FC<CheckersBoardProps> = ({ roomId }) => {
  // const { username, checkersPieceColor } = useSelector(state => state.user);
  // const { socket } = useSelector(state => state.socket);
  // const checkersSockets = useSelector(state => state.checkersSockets);

  const [board, setBoard] = useState<CheckersBoardType>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  // const windowSize = useWindowSize();
  const [gameOver, setGameOver] = useState<{
    gameOver: boolean;
    winnerName: string;
    winnerColor: CheckersPieceColor;
  }>({
    gameOver: false,
    winnerName: "",
    winnerColor: "" as CheckersPieceColor
  });

  let [userPieceColor, setUserPieceColor] = useState<CheckersPieceColor>("white");

  useEffect(() => {
    let tempBoard = board.map(r => r);

    for (let row = 0; row < tempBoard.length; row++) {
      for (let col = 0; col < tempBoard.length; col++) {
        if (row < 2) {
          if (row === 0 && col % 2 === 0) {
            tempBoard[row][col] = new CheckersPiece("white", [row, col]);
          } else if (row === 1 && col % 2 !== 0) {
            tempBoard[row][col] = new CheckersPiece("white", [row, col]);
          }
        }

        if (row > 5) {
          if (row === 6 && col % 2 === 0) {
            tempBoard[row][col] = new CheckersPiece("red", [row, col]);
          } else if (row === 7 && col % 2 !== 0) {
            tempBoard[row][col] = new CheckersPiece("red", [row, col]);
          }
        }
      }
    }

    setBoard(tempBoard);
  }, []);

  useEffect(() => {
    socket = io("http://localhost:8000");

    socket.emit(socketEmitEvents.JOIN_A_ROOM, { roomId: `checkers_${roomId}` });
  }, []);

  useEffect(() => {
    socket.on(
      socketListenEvents.OPPONENT_PLAYED_A_MOVE,
      (cellsClicked: ClickedCellsType) => {
        let tempBoard = board.map(b => b);

        game.movePiece(tempBoard, cellsClicked);

        setBoard(tempBoard);
      }
    );

    socket.on(
      socketListenEvents.CHECKERS_COLOR_SELECTED,
      (data: { color: CheckersPieceColor }) => {
        setUserPieceColor(data.color);
      }
    );

    socket.on("gameHasEnded", gameOverObject => setGameOver(gameOverObject));
  }, []);

  // useEffect(() => {
  // console.log("changed checkerspiece color to ", checkersPieceColor);
  // }, []);

  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let cellsClicked = game.showValidMoves(userPieceColor, tempBoard, row, col);
      console.log(cellsClicked);
      setBoard(tempBoard);

      if (cellsClicked && cellsClicked.rows.length === 2) {
        socket.emit(socketEmitEvents.USER_PLAYED_A_MOVE, cellsClicked);
      }

      // let isGameOver = game.isGameOver(board);

      // if (isGameOver) {
      //   let newGameOverObject = {
      //     gameOver: true,
      //     winnerColor: game.winner,
      //     winnerName:
      //       game.winner === checkersPieceColor
      //         ? getPlayerName("self")
      //         : getPlayerName("opponent")
      //   };

      //   socket.emit("gameOver", newGameOverObject);

      //   setGameOver(newGameOverObject);
      // }
    }
  };

  return (
    // <div style={{ margin: windowSize[0] < 910 ? "2rem 0" : "" }}>
    <div>
      <div style={{ height: "2rem" }}>{/* <h3>{getPlayerName("opponent")}</h3> */}</div>
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
            flexDirection: userPieceColor === "red" ? "column" : "column-reverse"
          }}
        >
          {board.map((row, ri) => {
            return (
              <div style={{ margin: 0, padding: 0, display: "flex" }} key={`row${ri}`}>
                {row.map((_col, ci) => {
                  let color = (ri + ci) % 2 === 0 ? "black" : "red";

                  let image = "";
                  let piece = board[ri][ci];
                  let blueDot = false;

                  if (piece instanceof CheckersPiece) {
                    if (piece.color === "white") {
                      if (piece.isKing) image = "images/checkers/WhiteKing.png";
                      else image = "images/checkers/WhitePiece.png";
                    } else {
                      if (piece.isKing) image = "images/checkers/RedKing.png";
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
                      showMoves={showMoves}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height: "2rem", padding: "0.5rem 0" }}>
        {/* <h3>{getPlayerName("self")}</h3> */}
      </div>
    </div>
  );
};

export default CheckersBoard;
