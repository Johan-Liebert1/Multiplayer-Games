import CheckersPiece from "./CheckersPiece";

class CheckersGame {
	constructor() {
		this.cellsClicked = { rows: [], cols: [] };
		this.numClicks = 0;
		this.turn = "red";
		this.selected = null;
		this.redPiecesOnBoard = 8;
		this.whitePiecesOnBoard = 8;
		this.gameOver = false;
		this.winner = null;
	}

	getStr = (row, col) => String(row) + "," + String(col);

	clearDots = board => {
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				if (board[i][j] === "dot") board[i][j] = 0;
			}
		}
	};

	showDots = (board, moves) => {
		Object.keys(moves).forEach(key => {
			// key = row,col
			const [row, col] = key.split(",").map(k => Number(k));

			if (moves[key] === "valid") {
				board[row][col] = "dot";
			} else if (moves[key][0] === "capturing") {
				board[row][col] = "dot";
			}
		});
	};

	showValidMoves = (userColor, board, row, col) => {
		if (
			board[row][col] instanceof CheckersPiece &&
			board[row][col].color !== userColor
		)
			return;

		this.clearDots(board);

		// console.log("inside show validMoves");

		if (board[row][col] !== 0 && board[row][col] !== "dot") {
			// console.log(board[row][col]);
			if (board[row][col].color === this.turn) {
				// console.log("calculating piece moves");

				let piece = board[row][col];
				let pieceMoves = piece.validMoves(board);

				this.showDots(board, pieceMoves);

				piece.isClicked = true;
			}
		}
		let tempCellsClicked = this.select(board, row, col);

		return tempCellsClicked;
	};

	select = (board, row, col) => {
		// console.log("select called");
		if (this.numClicks === 0) {
			if (board[row][col] === 0) return;
			else if (board[row][col] === "dot") return;
			else if (board[row][col].color !== this.turn) return;
			else {
				this.cellsClicked.rows.push(row);
				this.cellsClicked.cols.push(col);
				this.numClicks++;
				return this.cellsClicked;
			}
		} else if (this.numClicks === 1) {
			// a piece has already been clicked

			if (board[row][col] instanceof CheckersPiece) {
				// if player clicked on another piece of his color, do not changeTurn

				if (board[row][col].color === this.turn) {
					this.cellsClicked.rows[0] = row;
					this.cellsClicked.cols[0] = col;
					return this.cellsClicked;
				}
			}

			let str = this.getStr(row, col);
			let piece = board[this.cellsClicked.rows[0]][this.cellsClicked.cols[0]];
			const validPieceMoves = piece.validMoves(board);
			if (!(str in validPieceMoves)) {
				return;
			}

			// update this.cellsClicked for socket connection
			this.cellsClicked.rows.push(row);
			this.cellsClicked.cols.push(col);

			let tempCellsClicked = this.movePiece(
				board,
				this.cellsClicked,
				validPieceMoves
			);

			return tempCellsClicked;
		}
	};

	movePiece = (board, clickedCells, validPieceMoves = null) => {
		// clicked cells is basically this.cellsClicked, but we take it as a
		// parameter so that we can also use it for sockets

		let { rows, cols } = clickedCells;

		const [rowi, rowf] = rows;
		const [coli, colf] = cols;

		if (!validPieceMoves) {
			validPieceMoves = board[rowi][coli].validMoves(board);
		}

		if (validPieceMoves[this.getStr(rowf, colf)] === "valid") {
			// not a capturing move
			let piece = board[rowi][coli];

			piece.setRowCol(rowf, colf);

			// clicked cell is a valid move
			board[rowi][coli] = 0;
			board[rowf][colf] = piece;
		} else if (validPieceMoves[this.getStr(rowf, colf)][0] === "capturing") {
			// if it is a capturing move then the info about the piece captured
			// is stored in the second position of the array
			const { row, col } = validPieceMoves[this.getStr(rowf, colf)][1];

			let piece = board[rowi][coli];
			let capturedPiece = board[row][col];

			piece.setRowCol(rowf, colf);

			if (capturedPiece.isKing) {
				piece.makeKing();
			}

			if (capturedPiece.color === "white") {
				this.whitePiecesOnBoard--;
			} else if (capturedPiece.color === "red") {
				this.redPiecesOnBoard--;
			}

			// clicked cell is a valid move
			board[rowi][coli] = 0;
			board[row][col] = 0; // remove the captured piece
			board[rowf][colf] = piece;
		}

		let tcc = this.cellsClicked;

		this.clearDots(board);
		this.changeTurn();

		return tcc;
	};

	colorHasMovesLeft = (board, color) => {
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board.length; col++) {
				if (
					board[row][col] !== 0 &&
					board[row][col] !== "dot" &&
					board[row][col].color === color
				) {
					if (Object.keys(board[row][col].validMoves(board) > 0)) {
						return true;
					}
				}
			}
		}

		return false;
	};

	redWins = () => {
		this.gameOver = true;
		this.winner = "red";
		return this.gameOver;
	};

	whiteWins = () => {
		this.gameOver = true;
		this.winner = "white";
		return this.gameOver;
	};

	isGameOver = board => {
		if (this.redPiecesOnBoard === 0) {
			return this.whiteWins();
		}

		if (this.whitePiecesOnBoard === 0) {
			return this.redWins();
		}

		if (!this.colorHasMovesLeft(board, "white")) {
			return this.redWins();
		}

		if (!this.colorHasMovesLeft(board, "red")) {
			return this.whiteWins();
		}

		return false;
	};

	changeTurn = () => {
		this.cellsClicked = { rows: [], cols: [] };
		this.numClicks = 0;

		this.turn = this.turn === "white" ? "red" : "white";
	};
}

export default CheckersGame;
