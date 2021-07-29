// react stuff
import React, { useState, useEffect } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";

// actions
import { setSocketAction } from "../../store/actions/socketActions";

// components
import GameOverComponent from "../allGames/GameOverComponent";
import Cell from "../allGames/Cell";

// checkers
import CheckersPiece from "../../classes/checkers/CheckersPiece";
import CheckersGame from "../../classes/checkers/CheckersGame";

// sockets
import { io } from "socket.io-client";

// types
import { ClickedCellsType, UpdateGameDetails } from "../../types/games";
import { socketEmitEvents, socketListenEvents } from "../../types/socketEvents";
import { CheckersBoardType, CheckersPieceColor } from "../../types/checkersTypes";
import { SocketState } from "../../types/store/storeTypes";
import { useRef } from "react";
import { getNewCheckersBoard } from "../../helpers/checkersBoard";

const game = new CheckersGame();
let socket: SocketState;

interface CheckersBoardProps {
  roomId: string;
}

interface GameOverState {
  gameOver: boolean;
  winnerName: string;
  winnerColor: CheckersPieceColor;
}

const CheckersBoard: React.FC<CheckersBoardProps> = ({ roomId }) => {
  const { user } = useTypedSelector(state => state);
  const dispatch = useDispatch();

  const [board, setBoard] = useState<CheckersBoardType>(() => getNewCheckersBoard());

  const [gameOver, setGameOver] = useState<GameOverState>({
    gameOver: false,
    winnerName: "",
    winnerColor: "" as CheckersPieceColor
  });

  const [userPieceColor, setUserPieceColor] = useState<CheckersPieceColor>("white");
  const [player2Name, setPlayer2Name] = useState<string>('"No one else is here"');

  const checkersBoardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket = io("http://localhost:8000");

    socket.emit(socketEmitEvents.JOIN_A_ROOM, {
      roomId: `checkers_${roomId}`,
      username: user.username
    });

    dispatch(setSocketAction(socket));
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

    socket.on(socketListenEvents.CHESS_PLAYER_2_JOINED, (data: { users: string[] }) => {
      setPlayer2Name(data.users.filter(username => username !== user.username)[0]);
    });

    socket.on(socketListenEvents.CHECKERS_GAME_OVER, (gameOverObject: GameOverState) =>
      setGameOver(gameOverObject)
    );
  }, []);
  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let cellsClicked = game.showValidMoves(userPieceColor, tempBoard, row, col);
      setBoard(tempBoard);

      if (cellsClicked && cellsClicked.rows.length === 2) {
        socket.emit(socketEmitEvents.USER_PLAYED_A_MOVE, cellsClicked);
      }

      let isGameOver = game.isGameOver(board);

      if (isGameOver) {
        let newGameOverObject = {
          gameOver: true,
          winnerColor: game.winner as CheckersPieceColor,
          winnerName: game.winner === userPieceColor ? user.username : player2Name
        };

        socket.emit(socketEmitEvents.CHECKERS_GAME_OVER, newGameOverObject);

        setGameOver(newGameOverObject);
      }
    }
  };

  return (
    // <div style={{ margin: windowSize[0] < 910 ? "2rem 0" : "" }}>
    <div>
      <div style={{ height: "2rem" }}>
        <h3>{player2Name}</h3>
      </div>
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
          ref={checkersBoardRef}
        >
          {board.map((row, ri) => {
            return (
              <div style={{ margin: 0, padding: 0, display: "flex" }} key={`row${ri}`}>
                {row.map((_col, ci) => {
                  let color = (ri + ci) % 2 === 0 ? "#222f3e" : "#e74c3c";

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
                      boardRef={checkersBoardRef}
                      userCheckersColor={userPieceColor}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height: "2rem", padding: "0.5rem 0" }}>
        <h3>{user.username}</h3>
      </div>
    </div>
  );
};

export default CheckersBoard;
