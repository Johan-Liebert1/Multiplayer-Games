import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import "../styles/Chat.css";

const Chat = () => {
	// react use effect has a call to setMessage, so I'm using setInputMessage
	const [inputMessage, setInputMessage] = useState("");
	const [messageList, setMessageList] = useState([]);

	const { socket } = useSelector(state => state.socket);
	const { username } = useSelector(state => state.user);

	const displayBotMessage = msg => {
		let c;
		const user = msg.split(" ")[0];

		if (user === "Currently") {
			const s = msg.split("\n");
			let firstLine = s[0],
				secondLine = s[1];
			c = "#8e44ad";

			return (
				<p style={{ color: c }}>
					{firstLine}
					<span style={{ fontWeight: "bolder", display: "block" }}>
						{secondLine}
					</span>
				</p>
			);
		} else {
			const didLeave = msg.split(" ")[2];

			if (didLeave === "left") {
				c = "#e74c3c";
			} else {
				c = "#8e44ad";
			}

			return (
				<p style={{ color: c }}>
					<span style={{ fontWeight: "bolder" }}>{user} </span>
					{msg.split(" ").slice(1, msg.split(" ").length).join(" ")}
				</p>
			);
		}
	};

	const sendMessage = e => {
		e.preventDefault();
		socket.emit("newMessage", { inputMessage });
		setMessageList([
			...messageList,
			{ username: "You", newMessage: inputMessage, color: "black" }
		]);
		setInputMessage("");
	};

	useEffect(() => {
		// to receive the bot message that state how many users are currently in the chat
		socket.emit("newUserJoinsChat", { username });
	}, [socket, username]);

	useEffect(() => {
		socket.on("newMessageReceived", data => {
			let { newMessage, username, color } = data;
			setMessageList([...messageList, { username, newMessage, color }]);
		});

		const chatDiv = document.getElementById("chat-container");
		chatDiv.scrollTop = chatDiv.scrollHeight;
	}, [messageList, socket]);

	return (
		<div id="chat-form-container">
			<div id="chat-container">
				{messageList.map((m, i) => (
					<div key={i} className="message">
						<p
							className="username"
							style={{
								color: m.color
							}}
						>
							{m.username}
						</p>
						{m.username === "Bot" ? (
							displayBotMessage(m.newMessage)
						) : (
							<p>{m.newMessage}</p>
						)}
					</div>
				))}
			</div>
			<form onSubmit={sendMessage}>
				<input
					type="text"
					placeholder="Type your message"
					value={inputMessage}
					onChange={e => {
						e.preventDefault();
						setInputMessage(e.target.value);
					}}
				/>
			</form>
		</div>
	);
};

export default Chat;
