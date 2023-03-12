import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gameOverDiv } from "../../animations/animations";
import { ChessPieceColor } from "../../types/chessTypes";
import { CheckersPieceColor } from "../../types/checkersTypes";
import { Button } from "@material-ui/core";
import { CELL_SIZE } from "../../types/games";

interface GameOverComponentProps {
    winnerColor: ChessPieceColor | CheckersPieceColor;
    winnerName: string;
}

const GameOverComponent: React.FC<GameOverComponentProps> = ({
    winnerColor,
    winnerName,
}) => {
    const [hideDiv, setHideDiv] = useState(false);

    const getWinnerColor = () => {
        let color = "";
        color += winnerColor[0].toUpperCase();
        color += winnerColor.slice(1, winnerColor.length);

        return color;
    };

    return (
        <div
            style={{
                width: CELL_SIZE * 8 + "px",
                height: CELL_SIZE * 8 + "px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 900,
                position: "absolute",
                top: 0,
                left: 0,
            }}
        >
            <AnimatePresence>
                <motion.div
                    onClick={() => setHideDiv(true)}
                    style={{
                        height: "300px",
                        width: "300px",
                        backgroundColor: "#02203A",
                        zIndex: 99,
                        display: hideDiv ? "none" : "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        boxShadow: "0 0 20px grey",
                        borderRadius: "1rem",
                        justifySelf: "center",
                        alignSelf: "center",
                    }}
                    variants={gameOverDiv}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                >
                    <h2 style={{ color: winnerColor }}>
                        {winnerName} ({getWinnerColor()}) Won
                    </h2>

                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#2980B9", color: "white" }}
                    >
                        Rematch
                    </Button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
export default GameOverComponent;
