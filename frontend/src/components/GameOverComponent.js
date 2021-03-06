import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gameOverDiv } from "../styles/animations";

const GameOverComponent = ({ winnerColor, winnerName }) => {
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
				width: 560,
				height: 560,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 99,
				position: "absolute",
				top: 0,
				left: 0
			}}
		>
			<AnimatePresence>
				<motion.div
					onClick={() => setHideDiv(true)}
					style={{
						height: "300px",
						width: "300px",
						backgroundColor: "rgb(40, 40, 40)",
						zIndex: 99,
						display: hideDiv ? "none" : "flex",
						flexDirection: "column",
						justifyContent: "space-around",
						alignItems: "center",
						boxShadow: "0 0 20px grey",
						borderRadius: "1rem",
						justifySelf: "center",
						alignSelf: "center"
					}}
					variants={gameOverDiv}
					initial="hidden"
					animate="show"
					exit="exit"
				>
					<h2 style={{ color: winnerColor }}>
						{winnerName} ({getWinnerColor()}) Won
					</h2>

					<button>Rematch</button>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
export default GameOverComponent;
