import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import useWindowSize from "../../hooks/useWindowSize";

import Cell from "../allGames/Cell";
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
import ChessPiece from "../../classes/chess/ChessPiece";
import { CELL_SIZE, ClickedCellsType } from "../../types/games";
import { Button } from "@material-ui/core";

let game: ChessGame | null = null;

const ChessPlayBoard: React.FC = () => {
  // const { user } = uset(state => state);

  const [board, setBoard] = useState<ChessBoardType>(() =>
    new Array(8).fill(0).map(e => new Array(8).fill(0))
  );
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

  const windowSize = useWindowSize();

  const whiteKingPos = useRef<[number, number]>([0, 0]);
  const blackKingPos = useRef<[number, number]>([0, 0]);
  const chessBoardRef = useRef<HTMLDivElement>(null);

  const [generatedFen, setGeneratedFen] = useState("");

  const handlePawnPromotion = (pieceName: ChessPieceName) => {
    let { cellsClicked } = showPawnPromotionDialog;
    let tempBoard = board.map(row => [...row]);

    // the pawn has been moved at this point
    game?.promotePawn(tempBoard, pieceName, cellsClicked);

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

    console.log(pieceName, row, col);

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

    const targetRect = (e.target as HTMLDivElement).getBoundingClientRect();

    // Calculate the top and left positions
    const top = Math.abs(eleRect.top - targetRect.top);
    const left = Math.abs(eleRect.left - targetRect.left);

    const row = Math.floor(top / 65);
    const col = Math.floor(left / 65);

    if (row < 0 || row > 7 || col < 0 || col > 7) return;

    if ((e.target as HTMLDivElement).tagName === "DIV") return;

    let imgSrc = (e.target as HTMLDivElement).getAttribute("src") as string;
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
    setGameStarted(true);
    game = new ChessGame("white", whiteKingPos.current, blackKingPos.current);
    console.log(game);
    game.setInitiallyAttackedCells(board);
  };

  const resetBoard = () => {
    setBoard(() => getNewChessBoard());
    game = null;
    setGameStarted(false);
    setUserPieceColor("white");
  };

  const showMoves = (row: number, col: number) => {
    if (!gameOver.gameOver) {
      let tempBoard = board.map(b => b);
      let returnedValue = game?.showValidMoves(userPieceColor, tempBoard, row, col);

      if (returnedValue) {
        if ("cellsClicked" in returnedValue) {
          const { cellsClicked, castlingDone, pawnPromoted } = returnedValue;

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

      if (game?.isGameOver(board)) {
        // const winnerName = game.winner === userPieceColor ? user.username : player2Name;

        let newGameOverObject = {
          gameOver: true,
          winnerColor: game.winner,
          winnerName: ""
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
                showMoves={showMoves}
                boardRef={chessBoardRef}
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
    <motion.div style={{ margin: windowSize[0] < 910 ? "2rem" : "2rem" }}>
      <motion.div
        id="checkersBoard"
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
          {showChessBoard()}
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

        <div>{generatedFen}</div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "2rem",
            minHeight: CELL_SIZE * 4 + "px"
          }}
        >
          <Button onClick={handleStartGame} variant="contained" color="secondary">
            Start Game
          </Button>
          <Button onClick={resetBoard} variant="contained" color="secondary">
            Reset Board
          </Button>

          <Button
            onClick={() => setGeneratedFen(generateFenFromBoard(board))}
            variant="contained"
            color="secondary"
          >
            Generate fen
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChessPlayBoard;
