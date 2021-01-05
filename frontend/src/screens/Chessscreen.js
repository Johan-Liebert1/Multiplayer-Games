import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChessBoard from "../components/ChessBoard";
import Chat from "../components/Chat";

const ChessScreen = () => {
	const dispatch = useDispatch();
	const { socket } = useSelector(state => state.socket);

	const mainDivStyles = {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-around",
		minHeight: "100vh",
		minWidth: "85vw",
		flexWrap: "wrap"
	};

	useEffect(() => {
		document.title = "Games.IO | Chess";
	}, []);

	useEffect(() => {
		socket.emit("getChessPieceColor");

		socket.on("setChessPieceColor", ({ chessPieceColor }) => {
			// do this somewhere else when you have more games
			dispatch({
				type: "SET_CHESS_PIECE_COLOR",
				payload: chessPieceColor
			});
		});
	}, [socket, dispatch]);

	return (
		<div style={mainDivStyles}>
			<ChessBoard />
			<Chat />
		</div>
	);
};

export default ChessScreen;
