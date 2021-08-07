import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import Pawn from "../../classes/chess/Pawn";
import Rook from "../../classes/chess/Rook";
import Knight from "../../classes/chess/Knight";
import Bishop from "../../classes/chess/Bishop";
import King from "../../classes/chess/King";
import Queen from "../../classes/chess/Queen";
import ChessGame from "../../classes/chess/ChessGame";

import GameOverComponent from "../allGames/GameOverComponent";
import PawnPromotionDialog from "./PawnPromotionDialog";
import {
  ChessBoardType,
  ChessPieceColor,
  ChessPieceName,
  ChessWinner
} from "../../types/chessTypes";
import { getNewChessBoard } from "../../helpers/chessHelpers";
import { generateFenFromBoard } from "../../helpers/chessParsers";
import { CELL_SIZE, ClickedCellsType } from "../../types/games";
import { Button } from "@material-ui/core";
import { getEmptyMatrix } from "../../helpers/globalHelpers";
import RenderChessBoard from "./RenderChessBoard";
import { axiosInstance } from "../../config/axiosConfig";
import { useTypedSelector } from "../../hooks/useTypedSelector";

const ChessPlayBoard: React.FC = () => {
  const { user } = useTypedSelector(state => state);

  const [board, setBoard] = useState<ChessBoardType>(() => getNewChessBoard());
  const [gameStarted, setGameStarted] = useState(false);

  const [gameOver, setGameOver] = useState<{
    gameOver: boolean;
    winnerName: string;
    winnerColor: ChessWinner;
  }>({
    gameOver: false,
    winnerName: "",
    winnerColor: ""
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
  const [userPieceColor, setUserPieceColor] = useState<ChessPieceColor>("white");

  const whiteKingPos = useRef<[number, number]>([0, 0]);
  const blackKingPos = useRef<[number, number]>([0, 0]);
  const chessBoardRef = useRef<HTMLDivElement>(null);
  const chessGame = useRef<ChessGame | null>(null);

  const [generatedFen, setGeneratedFen] = useState("");

  const handlePawnPromotion = (pieceName: ChessPieceName) => {
    let { cellsClicked } = showPawnPromotionDialog;
    let tempBoard = board.map(row => [...row]);

    // the pawn has been moved at this point
    chessGame?.current?.promotePawn(tempBoard, pieceName, cellsClicked);

    setBoard(tempBoard);

    setShowPawnPromotionDialog({
      show: false,
      cellsClicked: {} as ClickedCellsType,
      pawnColor: ""
    });
  };

  const putPieceOnBoard = (
    pieceName: ChessPieceName,
    pieceColor: ChessPieceColor,
    row: number,
    col: number
  ) => {
    let tempBoard = board.map(row => row);

    switch (pieceName) {
      case "queen":
        tempBoard[row][col] = new Queen(pieceColor, row, col);
        break;

      case "rook":
        tempBoard[row][col] = new Rook(pieceColor, row, col);
        break;

      case "bishop":
        tempBoard[row][col] = new Bishop(pieceColor, row, col);
        break;

      case "knight":
        tempBoard[row][col] = new Knight(pieceColor, row, col);
        break;

      case "king":
        tempBoard[row][col] = new King(pieceColor, row, col);

        if (pieceColor === "white") whiteKingPos.current = [row, col];
        else blackKingPos.current = [row, col];

        break;

      case "pawn":
        tempBoard[row][col] = new Pawn(pieceColor, row, col);
        break;

      default:
        break;
    }

    setBoard(tempBoard);
  };

  const dragHasEnded = (e: Event) => {
    const ele = chessBoardRef.current as HTMLDivElement;
    const eleRect = ele.getBoundingClientRect();

    const targetRect = (e.target as HTMLElement).getBoundingClientRect();

    // Calculate the top and left positions
    const top = Math.abs(eleRect.top - targetRect.top);
    const left = Math.abs(eleRect.left - targetRect.left);

    const row = Math.floor(top / CELL_SIZE);
    const col = Math.floor(left / CELL_SIZE);

    if (row < 0 || row > 7 || col < 0 || col > 7) return;

    if ((e.target as HTMLElement).tagName === "DIV") return;

    let imgSrc = (e.target as HTMLElement).getAttribute("src") as string;
    let pieceColor, pieceName;

    const possibleNames = imgSrc.slice(imgSrc.lastIndexOf("/") + 1);

    pieceColor = possibleNames.slice(0, 5) as ChessPieceColor;
    pieceName = possibleNames
      .split(".")[0]
      .slice(5)
      .toLowerCase()
      .trim() as ChessPieceName;

    putPieceOnBoard(pieceName, pieceColor, row, col);
  };

  const handleStartGame = () => {
    // setGameStarted(true);
    chessGame.current = new ChessGame(
      "white",
      whiteKingPos.current,
      blackKingPos.current
    );
    // console.log(game);
    // console.log(board);

    setTimeout(() => {
      chessGame.current?.setInitiallyAttackedCells(board);
    }, 500);
  };

  useEffect(() => {
    chessGame.current?.setInitiallyAttackedCells(board);
  }, []);

  const resetBoard = (empty = true) => {
    if (empty) setBoard(() => getEmptyMatrix(8));
    else {
      chessGame.current = new ChessGame();
      setBoard(() => getNewChessBoard());
    }

    // game = null;
    setGameStarted(false);
    setUserPieceColor("white");
  };

  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let returnedValue = chessGame.current?.showValidMoves(
        userPieceColor,
        tempBoard,
        row,
        col
      );

      if (returnedValue) {
        if ("cellsClicked" in returnedValue) {
          const { cellsClicked, pawnPromoted } = returnedValue;

          setUserPieceColor(c => (c === "white" ? "black" : "white"));

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

      if (chessGame.current?.isGameOver(board)) {
        // const winnerName = game.winner === userPieceColor ? user.username : player2Name;

        let newGameOverObject = {
          gameOver: true,
          winnerColor: chessGame.current.winner,
          winnerName: ""
        };

        setGameOver(newGameOverObject);
      }
    }
  };

  const btnStyles = (bg: string, c: string = "white") => ({
    color: c,
    backgroundColor: bg
  });

  const buttons = [
    {
      text: "Start Game",
      clickHandler: () => {
        handleStartGame();
        // console.log("wrong");
      },
      style: btnStyles("#16a085")
    },
    {
      text: "Reset Board",
      clickHandler: () => {
        resetBoard(true);
      },
      style: btnStyles("#c0392b")
    },
    {
      text: "Default Board",
      clickHandler: () => {
        resetBoard(false);
      },
      style: btnStyles("#2980b9")
    },
    {
      text: "Get Moves String",
      clickHandler: () => {
        console.log(chessGame.current?.movesString);
      },
      style: btnStyles("#198510")
    },
    {
      text: "Generate FEN",
      clickHandler: () => {
        generateFenFromBoard(board);
      },
      style: btnStyles("#8e44ad")
    }
  ];

  if (user.username) {
    buttons.push({
      text: "Save Game",
      clickHandler: () => {
        const data = JSON.stringify({
          player1: user.username,
          player2: "Johan",
          moves: chessGame.current?.getAllMoves()
        });

        axiosInstance
          .post("/games/chess/savegame", data, {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${user.token}`
            }
          })
          .then(resp => {
            console.log(resp.data);
          });
      },
      style: btnStyles("#1321e6")
    });
  }

  return (
    <motion.div
      style={{
        minWidth: "100vw",
        minHeight: "92vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div
        style={{
          position: "relative",
          margin: "2rem 0",
          display: "flex",
          alignItems: "center"
        }}
      >
        {gameOver.gameOver && (
          <GameOverComponent
            winnerColor={gameOver.winnerColor as ChessPieceColor}
            winnerName={gameOver.winnerName}
          />
        )}

        {showPawnPromotionDialog.show && (
          <PawnPromotionDialog
            pawnColor={showPawnPromotionDialog.pawnColor as ChessPieceColor}
            handlePawnPromotion={handlePawnPromotion}
          />
        )}
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            background: "url(/images/chess/chessBoard.jpg)",
            objectFit: "contain",
            backgroundSize: `${CELL_SIZE * board.length}px, ${CELL_SIZE * board.length}px`
          }}
          ref={chessBoardRef}
        >
          <RenderChessBoard
            board={board}
            chessBoardRef={chessBoardRef}
            userPieceColor={userPieceColor}
            testBoard={true}
            movePiece={showMoves}
          />
        </motion.div>

        <motion.div style={{ display: "flex" }}>
          {["white", "black"].map(color => (
            <motion.div style={{ display: "flex", flexDirection: "column" }} key={color}>
              {["King", "Queen", "Rook", "Bishop", "Knight", "Pawn"].map(piece => (
                <motion.div key={`${color}-${piece}`}>
                  <motion.img
                    drag
                    onDragEnd={dragHasEnded}
                    dragConstraints={{
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                    }}
                    dragTransition={{ bounceStiffness: 700, bounceDamping: 50 }}
                    whileHover={{ cursor: "grab" }}
                    dragElastic={1}
                    src={`${window.location.origin}/images/chess/${color}${piece}.png`}
                    alt={`white${piece}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "2rem",
            minHeight: CELL_SIZE * 4 + "px"
          }}
        >
          {buttons.map((btn, idx) => (
            <Button
              onClick={btn.clickHandler}
              variant="contained"
              style={btn.style}
              key={idx}
            >
              {btn.text}
            </Button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChessPlayBoard;
