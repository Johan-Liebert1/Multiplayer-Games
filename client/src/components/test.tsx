import { NewChessGame } from "../classes/newchess/NewChessGame";
import RenderChessBoard from "./chess/RenderChessBoard";
import { useCallback, useRef, useState } from "react";
import { NewChessPiece } from "../classes/newchess/NewChessPiece";

const TestComponent = () => {
    const game = useRef(new NewChessGame());
    const ref = useRef<HTMLDivElement | null>(null);

    const [board, setBoard] = useState(game.current.board);
    const [dots, setDots] = useState<string[]>([]);

    const clickedCells = useRef<[number, number][]>([]);

    const movePiece = useCallback(
        (row: number, col: number) => {
            clickedCells.current.push([row, col]);

            if (clickedCells.current.length === 2) {
                const [newRow, newCol] = clickedCells.current[1];

                if (game.current.board[newRow][newCol] !== 0) {
                    clickedCells.current.pop();
                    return;
                }

                game.current.movePiece(clickedCells.current);

                clickedCells.current = [];
            }

            for (const row of game.current.board) {
                for (const piece of row) {
                    if (piece instanceof NewChessPiece) {
                        piece.calculateMoves(board);
                    }
                }
            }

            const piece = board[row][col];

            if (piece !== 0 && clickedCells.current.length === 1) {
                console.log(piece, [...piece.moves.valid, ...piece.moves.capturing]);
                setDots([...piece.moves.valid, ...piece.moves.capturing]);
            } else if (clickedCells.current.length === 0) {
                setDots([]);
            }

            setBoard(game.current.board.map(r => r.map(c => c)));
        },
        [board]
    );

    return (
        <div
            ref={ref}
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <RenderChessBoard
                board={board}
                userPieceColor={"white"}
                chessBoardRef={ref}
                testBoard={false}
                movePiece={movePiece}
                dots={dots}
            />
        </div>
    );
};

export default TestComponent;
