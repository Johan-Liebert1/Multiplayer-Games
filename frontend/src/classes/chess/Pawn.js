import Piece from "./ChessPiece";

class Pawn extends Piece {
	constructor(color, row, col) {
		super(color, row, col);
		this.hasMoved = false;
		this.pieceName = "pawn";
		this.image = `images/chess/${this.color}Pawn.png`;

		this.setHasMoved();
	}

	setHasMoved = () => {
		if (this.color === "black" && this.row !== 1) {
			this.hasMoved = true;
		}

		if (this.color === "white" && this.row !== 6) {
			this.hasMoved = true;
		}
	};

	validMoves = (board, kingParameters, initialCall = false) => {
		this.resetMoves();

		const adder = this.color === "black" ? 1 : -1;

		if (!this.hasMoved && board[this.row + adder][this.col] === 0) {
			if (board[this.row + adder * 2][this.col] === 0) {
				this.moves[this.getStr(this.row + adder * 2, this.col)] = "valid";
			}
		}

		if (this.row + adder >= 0 && this.row + adder < 8) {
			if (board[this.row + adder][this.col] === 0) {
				this.moves[this.getStr(this.row + adder, this.col)] = "valid";
			}

			// capturing moves
			if (this.col + 1 < 8) {
				if (board[this.row + adder][this.col + 1] !== 0 || initialCall) {
					if (
						board[this.row + adder][this.col + 1].color !== this.color ||
						initialCall
					) {
						this.moves[this.getStr(this.row + adder, this.col + 1)] =
							"capturing";
					} else {
						this.protectingMoves[
							this.getStr(this.row + adder, this.col + 1)
						] = "protecting";
					}
				}
			}
			if (this.col - 1 >= 0) {
				if (board[this.row + adder][this.col - 1] !== 0 || initialCall) {
					if (
						board[this.row + adder][this.col - 1].color !== this.color ||
						initialCall
					) {
						this.moves[this.getStr(this.row + adder, this.col - 1)] =
							"capturing";
					} else {
						this.protectingMoves[
							this.getStr(this.row + adder, this.col - 1)
						] = "protecting";
					}
				}
			}
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

	display() {
		return this.color[0].toUpperCase() + "P";
	}
}

export default Pawn;
