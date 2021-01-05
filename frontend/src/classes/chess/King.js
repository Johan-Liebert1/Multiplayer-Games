import Piece from "./ChessPiece";
import Rook from "./Rook";

class King extends Piece {
	constructor(color, row, col) {
		super(color, row, col);
		this.pieceName = "king";
		this.image = `images/chess/${this.color}King.png`;
		this.isKing = true;
		this.hasMoved = false;
	}

	notAllowKingToMoveToAttackedCell = kingParameters => {
		// not allow king to capture a protected piece
		let newValidMoves = {};
		const { cellsUnderAttackByWhite, cellsUnderAttackByBlack } = kingParameters;
		const cellsUnderAttack =
			this.color === "white" ? cellsUnderAttackByBlack : cellsUnderAttackByWhite;

		const moveKeys = Object.keys(this.moves);
		const otherKeys = Object.keys(cellsUnderAttack);

		for (let i = 0; i < moveKeys.length; i++) {
			let moveAllowed = true;
			for (let j = 0; j < otherKeys.length; j++) {
				if (moveKeys[i] in cellsUnderAttack[otherKeys[j]]) {
					moveAllowed = false;
					break;
				}
			}
			if (moveAllowed) {
				newValidMoves[moveKeys[i]] = this.moves[moveKeys[i]];
			}
		}

		return newValidMoves;
	};

	isPathBetweenRookAndKingBlocked = (board, rookColor) => {
		const row = rookColor === "white" ? 7 : 0;
		const blockedPath = { leftBlocked: false, rightBlocked: false };

		const leftCols = [1, 2, 3];
		const rightCols = [5, 6];

		leftCols.forEach(col => {
			if (board[row][col] instanceof Piece) blockedPath.leftBlocked = true;
		});

		rightCols.forEach(col => {
			if (board[row][col] instanceof Piece) blockedPath.rightBlocked = true;
		});

		return blockedPath;
	};

	isRookPresent = (board, rookColor) => {
		const row = rookColor === "white" ? 7 : 0;

		if (!(board[row][0] instanceof Rook) && !(board[row][7] instanceof Rook))
			return false;
		else if (board[row][0] instanceof Rook && board[row][0].hasMoved) return false;
		else if (board[row][7] instanceof Rook && board[row][7].hasMoved) return false;

		return true;
	};

	addCastlingMoves = (board, kingParameters) => {
		const { whiteKingInCheck, blackKingInCheck } = kingParameters;

		if (this.hasMoved) return;

		if (this.color === "white") {
			// if there's an unmoved Rook
			if (whiteKingInCheck) return;

			// if there's no rook then return
			if (!this.isRookPresent(board, this.color)) return;

			// if any piece is blocking the path between both rooks and king, return
			const { leftBlocked, rightBlocked } = this.isPathBetweenRookAndKingBlocked(
				board,
				this.color
			);

			if (leftBlocked && rightBlocked) return; // both paths are blocked

			if (!leftBlocked) {
				this.moves[this.getStr(this.row, this.col - 2)] = "castling";
			}

			if (!rightBlocked) {
				this.moves[this.getStr(this.row, this.col + 2)] = "castling";
			}
		} else {
			if (blackKingInCheck) return;
			if (!this.isRookPresent(board, this.color)) return;

			const { leftBlocked, rightBlocked } = this.isPathBetweenRookAndKingBlocked(
				board,
				this.color
			);

			if (leftBlocked && rightBlocked) return;

			if (!leftBlocked) {
				this.moves[this.getStr(this.row, this.col - 2)] = "castling";
			}

			if (!rightBlocked) {
				this.moves[this.getStr(this.row, this.col + 2)] = "castling";
			}
		}
	};

	validMoves = (board, kingParameters) => {
		this.resetMoves();

		// vertical
		if (this.row + 1 < 8) {
			// vertical down
			if (board[this.row + 1][this.col] === 0) {
				this.moves[this.getStr(this.row + 1, this.col)] = "valid";
			} else if (board[this.row + 1][this.col].color !== this.color) {
				this.moves[this.getStr(this.row + 1, this.col)] = "capturing";
			} else if (board[this.row + 1][this.col].color === this.color) {
				this.protectingMoves[this.getStr(this.row + 1, this.col)] = "protecting";
			}

			// lower right
			if (this.col + 1 < 8) {
				if (board[this.row + 1][this.col + 1] === 0) {
					this.moves[this.getStr(this.row + 1, this.col + 1)] = "valid";
				} else if (board[this.row + 1][this.col + 1].color !== this.color) {
					this.moves[this.getStr(this.row + 1, this.col + 1)] = "capturing";
				} else if (board[this.row + 1][this.col + 1].color === this.color) {
					this.protectingMoves[this.getStr(this.row + 1, this.col + 1)] =
						"protecting";
				}
			}

			// lower left
			if (this.col - 1 >= 0) {
				if (board[this.row + 1][this.col - 1] === 0) {
					this.moves[this.getStr(this.row + 1, this.col - 1)] = "valid";
				} else if (board[this.row + 1][this.col - 1].color !== this.color) {
					this.moves[this.getStr(this.row + 1, this.col - 1)] = "capturing";
				} else if (board[this.row + 1][this.col - 1].color === this.color) {
					this.protectingMoves[this.getStr(this.row + 1, this.col - 1)] =
						"protecting";
				}
			}
		}

		// vertical
		if (this.row - 1 >= 0) {
			// vertical up
			if (board[this.row - 1][this.col] === 0) {
				this.moves[this.getStr(this.row - 1, this.col)] = "valid";
			} else if (board[this.row - 1][this.col].color !== this.color) {
				this.moves[this.getStr(this.row - 1, this.col)] = "capturing";
			} else if (board[this.row - 1][this.col].color === this.color) {
				this.protectingMoves[this.getStr(this.row - 1, this.col)] = "protecting";
			}

			// upper right
			if (this.col + 1 < 8) {
				if (board[this.row - 1][this.col + 1] === 0) {
					this.moves[this.getStr(this.row - 1, this.col + 1)] = "valid";
				} else if (board[this.row - 1][this.col + 1].color !== this.color) {
					this.moves[this.getStr(this.row - 1, this.col + 1)] = "capturing";
				} else if (board[this.row - 1][this.col + 1].color === this.color) {
					this.protectingMoves[this.getStr(this.row - 1, this.col + 1)] =
						"protecting";
				}
			}

			// upper left
			if (this.col - 1 >= 0) {
				if (board[this.row - 1][this.col - 1] === 0) {
					this.moves[this.getStr(this.row - 1, this.col - 1)] = "valid";
				} else if (board[this.row - 1][this.col - 1].color !== this.color) {
					this.moves[this.getStr(this.row - 1, this.col - 1)] = "capturing";
				} else if (board[this.row - 1][this.col - 1].color === this.color) {
					this.protectingMoves[this.getStr(this.row - 1, this.col - 1)] =
						"protecting";
				}
			}
		}

		// horizontal
		if (this.col + 1 < 8) {
			if (board[this.row][this.col + 1] === 0) {
				this.moves[this.getStr(this.row, this.col + 1)] = "valid";
			} else if (board[this.row][this.col + 1].color !== this.color) {
				this.moves[this.getStr(this.row, this.col + 1)] = "capturing";
			} else if (board[this.row][this.col + 1].color === this.color) {
				this.protectingMoves[this.getStr(this.row, this.col + 1)] = "protecting";
			}
		}

		if (this.col - 1 >= 0) {
			if (board[this.row][this.col - 1] === 0) {
				this.moves[this.getStr(this.row, this.col - 1)] = "valid";
			} else if (board[this.row][this.col - 1].color !== this.color) {
				this.moves[this.getStr(this.row, this.col - 1)] = "capturing";
			} else if (board[this.row][this.col - 1].color === this.color) {
				this.protectingMoves[this.getStr(this.row, this.col - 1)] = "protecting";
			}
		}

		// castling
		this.addCastlingMoves(board, kingParameters);

		// this.checkIfKingInCheck(kingParameters);
		this.moves = this.notAllowKingToMoveToAttackedCell(kingParameters);

		return this.moves;
	};

	setRowCol = (row, col) => {
		this.row = row;
		this.col = col;
		this.hasMoved = true;
	};

	display() {
		return this.color[0].toUpperCase() + "K";
	}
}

export default King;
