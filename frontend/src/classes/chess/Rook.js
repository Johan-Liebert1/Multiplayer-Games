import Piece from "./ChessPiece";

class Rook extends Piece {
	constructor(color, row, col) {
		super(color, row, col);
		this.pieceName = "rook";
		this.hasMoved = false;
		this.image = `images/chess/${this.color}Rook.png`;
	}

	getCellsBetweenPieces = kingPos => {
		let rowAdder = 0,
			colAdder = 0;

		let kingRow = kingPos[0],
			kingCol = kingPos[1];

		let cellsBetweenPieces = {};

		// up
		if (kingRow < this.row && kingCol === this.col) {
			rowAdder = -1;
			colAdder = 0;
		} else if (kingRow > this.row && kingCol === this.col) {
			//down
			rowAdder = 1;
			colAdder = 0;
		} else if (kingRow === this.row && kingCol < this.col) {
			// left
			rowAdder = 0;
			colAdder = -1;
		} else if (kingRow === this.row && kingCol > this.col) {
			// right
			rowAdder = 0;
			colAdder = 1;
		}

		if (rowAdder !== 0) {
			for (let row = this.row + rowAdder; row !== kingRow; row += rowAdder) {
				cellsBetweenPieces[this.getStr(row, this.col)] = "valid";
			}
		}

		if (colAdder !== 0) {
			for (let col = this.col + colAdder; col !== kingCol; col += colAdder) {
				cellsBetweenPieces[this.getStr(this.row, col)] = "valid";
			}
		}

		return cellsBetweenPieces;
	};

	validMoves = (board, kingParameters) => {
		this.resetMoves();

		// go outwards from the current row, i.e iterate through columns
		for (let c = this.col - 1; c >= 0; c--) {
			if (board[this.row][c] !== 0) {
				if (board[this.row][c].color === this.color) {
					this.protectingMoves[this.getStr(this.row, c)] = "protecting";
					break;
				} else {
					this.moves[this.getStr(this.row, c)] = "capturing";
					break;
				}
			}

			this.moves[this.getStr(this.row, c)] = "valid";
		}

		for (let c = this.col + 1; c < 8; c++) {
			if (board[this.row][c] !== 0) {
				if (board[this.row][c].color === this.color) {
					this.protectingMoves[this.getStr(this.row, c)] = "protecting";
					break;
				} else {
					this.moves[this.getStr(this.row, c)] = "capturing";
					break;
				}
			}

			this.moves[this.getStr(this.row, c)] = "valid";
		}

		// go outwards from the current column, i.e iterate through rows
		for (let r = this.row - 1; r >= 0; r--) {
			if (board[r][this.col] !== 0) {
				if (board[r][this.col].color === this.color) {
					this.protectingMoves[this.getStr(r, this.col)] = "protecting";
					break;
				} else {
					this.moves[this.getStr(r, this.col)] = "capturing";
					break;
				}
			}

			this.moves[this.getStr(r, this.col)] = "valid";
		}

		for (let r = this.row + 1; r < 8; r++) {
			if (board[r][this.col] !== 0) {
				if (board[r][this.col].color === this.color) {
					this.protectingMoves[this.getStr(r, this.col)] = "protecting";
					break;
				} else if (board[r][this.col].color !== this.color) {
					this.moves[this.getStr(r, this.col)] = "capturing";
					break;
				}
			}

			this.moves[this.getStr(r, this.col)] = "valid";
		}

		this.checkIfKingInCheck(kingParameters);
		this.handlePiecePinnedByRook(kingParameters, board);
		this.handlePiecePinnedByBishop(kingParameters, board);

		return this.moves;
	};

	setRowCol = (row, col) => {
		this.row = row;
		this.col = col;
		this.hasMoved = true;
	};
}

export default Rook;
