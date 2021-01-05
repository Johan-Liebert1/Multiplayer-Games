import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useWindowSize from "../hooks/useWindowSize";

import Cell from "./Cell";
import Pawn from "../classes/chess/Pawn";
import Rook from "../classes/chess/Rook";
import Knight from "../classes/chess/Knight";
import Bishop from "../classes/chess/Bishop";
import King from "../classes/chess/King";
import Queen from "../classes/chess/Queen";
import ChessGame from "../classes/chess/ChessGame";
import GameOverComponent from "./GameOverComponent";
import PawnPromotionDialog from "./PawnPromotionDialog";

const game = new ChessGame();

const ChessBoard = () => {
	const [board, setBoard] = useState([
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

	const { socket } = useSelector(state => state.socket);
	const { chessPieceColor, username } = useSelector(state => state.user);
	const chessSockets = useSelector(state => state.chessSockets);

	const windowSize = useWindowSize();
	const [gameOver, setGameOver] = useState({
		gameOver: false,
		winnerName: null,
		winnerColor: null
	});

	const [showPawnPromotionDialog, setShowPawnPromotionDialog] = useState({
		show: false,
		cellsClicked: null,
		pawnColor: null
	});

	useEffect(() => {
		game.setInitiallyAttackedCells(board);
	}, []);

	useEffect(() => {
		socket.on("opponentPlayedAMove", ({ cellsClicked }) => {
			let tempBoard = board.map(b => b);
			game.movePiece(tempBoard, cellsClicked);
			setBoard(tempBoard);
		});

		socket.on("opponentCastled", ({ cellsClicked }) => {
			let tempBoard = board.map(b => b);
			game.movePiece(tempBoard, cellsClicked);
			setBoard(tempBoard);
		});

		socket.on("opponentPromotedPawn", ({ pieceName, cellsClicked }) => {
			let tempBoard = board.map(b => b);
			game.promotePawn(tempBoard, pieceName, cellsClicked);
			setBoard(tempBoard);
		});

		socket.on("gameHasEnded", gameOverObject => setGameOver(gameOverObject));
	}, [socket]);

	const getPlayerName = player => {
		// player can be self or opponent
		if (player === "self") return username;

		for (let i = 0; i < chessSockets.length; i++) {
			if (
				chessSockets[i].chessPieceColor &&
				chessSockets[i].chessPieceColor !== chessPieceColor
			) {
				return chessSockets[i].username;
			}
		}
	};

	const handlePawnPromotion = pieceName => {
		let { cellsClicked } = showPawnPromotionDialog;
		let tempBoard = board.map(b => b);

		socket.emit("pawnPromoted", { pieceName, cellsClicked });

		// the pawn has been moved at this point
		game.promotePawn(tempBoard, pieceName, cellsClicked);

		setBoard(tempBoard);

		setShowPawnPromotionDialog({ show: false, cellsClicked: null, pawnColor: null });
	};

	const showMoves = (row, col) => {
		if (!gameOver.gameOver) {
			let tempBoard = board.map(b => b);
			let returnedValue = game.showValidMoves(chessPieceColor, tempBoard, row, col);

			if (returnedValue) {
				const { cellsClicked, castlingDone, pawnPromoted } = returnedValue;

				if (cellsClicked && cellsClicked.rows.length === 2) {
					if (!castlingDone && !pawnPromoted)
						socket.emit("movePlayed", { cellsClicked });
					if (castlingDone) {
						socket.emit("castlingDone", { cellsClicked });
					}
					if (pawnPromoted) {
						// the pawn has reached the other end of the board
						// but hasn't yet been protomted and is still just a pawn
						setShowPawnPromotionDialog({
							show: true,
							cellsClicked,
							pawnColor:
								tempBoard[cellsClicked.rows[1]][cellsClicked.cols[1]]
									.color
						});
					}
				}
			}

			setBoard(tempBoard);

			if (game.isGameOver(board)) {
				let newGameOverObject = {
					gameOver: true,
					winnerColor: game.winner,
					winnerName:
						game.winner === chessPieceColor
							? getPlayerName("self")
							: getPlayerName("opponent")
				};

				socket.emit("gameOver", newGameOverObject);

				setGameOver(newGameOverObject);
			}
		}
	};

	const showChessBoard = () => {
		return board.map((row, ri) => {
			return (
				<div style={{ margin: 0, padding: 0, display: "flex" }} key={`row${ri}`}>
					{row.map((col, ci) => {
						let color =
							(ri + ci) % 2 !== 0 ? "rgb(195,105,56)" : "rgb(239, 206,163)";

						let piece = board[ri][ci];
						let blueDot, redDot, isClicked;

						if (piece === "dot") {
							blueDot = true;
						}

						if (piece !== 0) {
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
								image={piece.image ? piece.image : false}
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
				<h3>{getPlayerName("opponent")}</h3>
			</div>

			<div id="checkersBoard" style={{ position: "relative" }}>
				{gameOver.gameOver && (
					<GameOverComponent
						winnerColor={gameOver.winnerColor}
						winnerName={gameOver.winnerName}
					/>
				)}

				{showPawnPromotionDialog.show && (
					<PawnPromotionDialog
						pawnColor={showPawnPromotionDialog.pawnColor}
						handlePawnPromotion={handlePawnPromotion}
					/>
				)}
				<div
					style={{
						display: "flex",
						flexDirection:
							chessPieceColor === "white" ? "column" : "column-reverse"
					}}
				>
					{showChessBoard(chessPieceColor)}
				</div>
			</div>
			<div style={{ height: "2rem", padding: "0.5rem 0" }}>
				<h3>{getPlayerName("self")}</h3>
			</div>
		</div>
	);
};

export default ChessBoard;
