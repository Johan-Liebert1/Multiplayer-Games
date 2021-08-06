// react stuff
import React, { useState, useEffect } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";

// actions
import { setSocketAction } from "../../store/actions/socketActions";

// components
import GameOverComponent from "../allGames/GameOverComponent";

// checkers
import CheckersGame from "../../classes/checkers/CheckersGame";

// sockets
import { io } from "socket.io-client";

// types
import { ClickedCellsType } from "../../types/games";
import { socketEmitEvents, socketListenEvents } from "../../types/socketEvents";
import { CheckersBoardType, CheckersPieceColor } from "../../types/checkersTypes";
import { SocketState } from "../../types/store/storeTypes";
import { useRef } from "react";
import { getNewCheckersBoard } from "../../helpers/checkersBoard";
import { updateGameDetailsApiCall } from "../../helpers/updateGameDetails";
import RenderCheckersBoard from "./RenderCheckersBoard";
import { baseURL } from "../../config/axiosConfig";

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
    socket = io(baseURL);

    socket.emit(socketEmitEvents.JOIN_A_ROOM, {
      roomId: `checkers_${roomId}`,
      username: user.username
    });

    updateGameDetailsApiCall(user.username, user.token, "chess", { started: true });

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

    socket.on(
      socketListenEvents.CHECKERS_PLAYER_2_JOINED,
      (data: { users: string[] }) => {
        const p2Name = data.users.filter(username => username !== user.username)[0];

        setPlayer2Name(p2Name);
      }
    );

    socket.on(socketListenEvents.CHECKERS_GAME_OVER, (gameOverObject: GameOverState) => {
      setGameOver(gameOverObject);
    });
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
        const winnerName = game.winner === userPieceColor ? user.username : player2Name;

        let newGameOverObject = {
          gameOver: true,
          winnerColor: game.winner as CheckersPieceColor,
          winnerName
        };

        socket.emit(socketEmitEvents.CHECKERS_GAME_OVER, newGameOverObject);

        updateGameDetailsApiCall(user.username, user.token, "checkers", {
          won: winnerName === user.username,
          lost: winnerName !== user.username
        });

        updateGameDetailsApiCall(player2Name, user.token, "checkers", {
          won: winnerName === player2Name,
          lost: winnerName !== player2Name
        });

        setGameOver(newGameOverObject);
      }
    }
  };

  return (
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
          <RenderCheckersBoard
            board={board}
            checkersBoardRef={checkersBoardRef}
            userPieceColor={userPieceColor}
            testBoard={false}
            movePiece={showMoves}
          />
        </div>
      </div>
      <div style={{ height: "2rem", padding: "0.5rem 0" }}>
        <h3>{user.username}</h3>
      </div>
    </div>
  );
};

export default CheckersBoard;
