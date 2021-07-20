import React, { useState, useEffect } from "react";
import Cell from "./Cell";

import CheckersPiece from "../classes/checkers/CheckersPiece";
import CheckersGame from "../classes/checkers/CheckersGame";
import { CheckersBoardType, CheckersPieceColor } from "../types/checkersTypes";

const game = new CheckersGame();

const CheckersBoard: React.FC = () => {
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
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    winnerName: null,
    winnerColor: null
  });

  let [checkersPieceColor, setCheckersPieceColor] = useState<CheckersPieceColor>("white");

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

  // useEffect(() => {
  // 	socket.on("opponentPlayedAMove", ({ cellsClicked }) => {
  // 		let tempBoard = board.map(b => b);

  // 		game.movePiece(tempBoard, cellsClicked);

  // 		setBoard(tempBoard);
  // 	});

  // 	socket.on("gameHasEnded", gameOverObject => setGameOver(gameOverObject));
  // }, [socket]);

  // const getPlayerName = player => {
  // 	// player can be self or opponent
  // 	if (player === "self") return username;

  // 	for (let i = 0; i < checkersSockets.length; i++) {
  // 		if (
  // 			checkersSockets[i].checkersPieceColor &&
  // 			checkersSockets[i].checkersPieceColor !== checkersPieceColor
  // 		) {
  // 			return checkersSockets[i].username;
  // 		}
  // 	}
  // };

  useEffect(() => {
    console.log("changed checkerspiece color to ", checkersPieceColor);
  }, [checkersPieceColor]);

  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let cellsClicked = game.showValidMoves(checkersPieceColor, tempBoard, row, col);
      console.log(cellsClicked);
      setBoard(tempBoard);

      if (cellsClicked && cellsClicked.rows.length === 2) {
        setCheckersPieceColor(oldVal => (oldVal === "white" ? "red" : "white"));
        // socket.emit("movePlayed", { cellsClicked });
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
        {/* {gameOver.gameOver && (
          <GameOverComponent
            winnerColor={gameOver.winnerColor}
            winnerName={gameOver.winnerName}
          />
        )} */}
        <div
        // style={{
        //   display: "flex",
        //   flexDirection: checkersPieceColor === "red" ? "column" : "column-reverse"
        // }}
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
