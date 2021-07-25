// react stuff
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";

// components
import Cell from "./Cell";
import GameOverComponent from "./GameOverComponent";
import PawnPromotionDialog from "./PawnPromotionDialog";

// gameplay
import ChessGame from "../classes/chess/ChessGame";
import Pawn from "../classes/chess/Pawn";
import Rook from "../classes/chess/Rook";
import Knight from "../classes/chess/Knight";
import Bishop from "../classes/chess/Bishop";
import King from "../classes/chess/King";
import Queen from "../classes/chess/Queen";
import ChessPiece from "../classes/chess/ChessPiece";

// types
import {
  ChessBoardType,
  ChessPieceColor,
  ChessPieceName,
  ChessWinner
} from "../types/chessTypes";
import { CheckersPieceColor } from "../types/checkersTypes";
import { CELL_SIZE, ClickedCellsType } from "../types/games";
import { io } from "socket.io-client";
import { RouteProps } from "../types/routeProps";
import { socketEmitEvents, socketListenEvents } from "../types/socketEvents";
import { SocketState } from "../types/store/storeTypes";
import { setSocketAction } from "../store/actions/socketActions";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { updateUserSocketDetails } from "../store/actions/userActions";

const game = new ChessGame();
let socket: SocketState;

interface ChessBoardProps extends RouteProps {
  roomId: string;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ roomId }) => {
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

  const dispatch = useDispatch();
  const user = useTypedSelector(state => state.user);

  const [userPieceColor, setUserPieceColor] = useState<ChessPieceColor>("white");
  const [player2Name, setPlayer2Name] = useState<string>('"No one else is here"');

  useEffect(() => {
    socket = io("http://localhost:8000");

    socket.emit(socketEmitEvents.JOIN_A_ROOM, {
      roomId: `chess_${roomId}`,
      username: user.username
    });

    dispatch(setSocketAction(socket));
    // eslint-disable-next-line
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
      socketListenEvents.CHESS_COLOR_SELECTED,
      (data: { color: ChessPieceColor; chatColor: string }) => {
        setUserPieceColor(data.color);
        dispatch(updateUserSocketDetails({ ...user, chatColor: data.chatColor }));
      }
    );

    socket.on(socketListenEvents.CHESS_PLAYER_2_JOINED, (data: { users: string[] }) => {
      console.log(socketListenEvents.CHESS_PLAYER_2_JOINED, data);
      setPlayer2Name(data.users.filter(username => username !== user.username)[0]);
    });

    // eslint-disable-next-line
  }, []);

  const windowSize = useWindowSize();

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

    // socket.emit("pawnPromoted", { pieceName, cellsClicked });

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
          const { cellsClicked, castlingDone, pawnPromoted } = returnedValue;

          socket.emit(socketEmitEvents.USER_PLAYED_A_MOVE, cellsClicked);

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

        // socket.emit("gameOver", newGameOverObject);

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
            // (ri + ci) % 2 !== 0 ? "rgb(201, 10, 20)" : "rgba(139, 133, 133, 0.959)";

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
      <div style={{ height: "2rem" }}>
        <h3>{player2Name}</h3>
      </div>

      <div
        id="checkersBoard"
        style={{
          position: "relative",
          background: "url(/images/chess/chessBoard.jpg)",
          objectFit: "contain",
          backgroundSize: `${CELL_SIZE * board.length}px, ${CELL_SIZE * board.length}px`
        }}
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
            flexDirection: userPieceColor === "white" ? "column" : "column-reverse"
          }}
        >
          {showChessBoard()}
        </div>
      </div>
      <div style={{ height: "2rem", padding: "0.5rem 0" }}>
        <h3>{user.username}</h3>
      </div>
    </div>
  );
};

export default withRouter(ChessBoard);
