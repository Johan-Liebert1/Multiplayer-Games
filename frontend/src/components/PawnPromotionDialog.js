import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { gameOverDiv } from "../styles/animations";

const PawnPromotionDialog = ({ pawnColor, handlePawnPromotion }) => {
	const [hideDiv, setHideDiv] = useState(false);

	const handleClick = pieceName => {
		setHideDiv(true);
		handlePawnPromotion(pieceName);
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
					style={{
						height: "100px",
						width: "300px",
						backgroundColor: "rgb(255,255,255)",
						zIndex: 99,
						display: hideDiv ? "none" : "flex",
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
					<div onClick={() => handleClick("queen")}>
						<img
							src={`images/chess/${pawnColor}Queen.png`}
							alt={`${pawnColor}queen`}
						/>
					</div>
					<div onClick={() => handleClick("rook")}>
						<img
							src={`images/chess/${pawnColor}Rook.png`}
							alt={`${pawnColor}rook`}
						/>
					</div>
					<div onClick={() => handleClick("bishop")}>
						<img
							src={`images/chess/${pawnColor}Bishop.png`}
							alt={`${pawnColor}bishop`}
						/>
					</div>
					<div onClick={() => handleClick("knight")}>
						<img
							src={`images/chess/${pawnColor}Knight.png`}
							alt={`${pawnColor}knight`}
						/>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default PawnPromotionDialog;
