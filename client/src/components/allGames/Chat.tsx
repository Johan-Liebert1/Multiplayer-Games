import React, { useState, useEffect } from "react";

import {
    FilledInput,
    FormControl,
    InputLabel,
    List,
    ListItemText,
    ListItem,
} from "@material-ui/core";
import { chatBoxStyles } from "../../styles/gameScreenStyles";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { socketEmitEvents, socketListenEvents } from "../../types/socketEvents";

interface ChatMessage {
    username: string;
    color: string;
    message: string;
}

const Chat: React.FC = () => {
    const { socket, user } = useTypedSelector((state) => state);

    const classes = chatBoxStyles();

    const [messageText, setMessageText] = useState<string>("");
    const [messageList, setMessageList] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on(
                socketListenEvents.RECEIVE_CHAT_MESSAGE,
                (chatMessage: ChatMessage) => {
                    setMessageList((m) => [...m, chatMessage]);
                }
            );

            socket.on("disconnect", () => {
                socket.emit("userDisconnected", { username: user.username });
            });
        }
    }, [socket]);

    const sendMessage = () => {
        if (messageText === "") return;

        const newMessage: ChatMessage = {
            username: user.username,
            color: user.chatColor || "red",
            message: messageText,
        };

        setMessageList((m) => [...m, newMessage]);

        socket?.emit(socketEmitEvents.SENT_CHAT_MESSAGE, newMessage);

        setMessageText("");
    };

    return (
        <div className={classes.root}>
            <List dense={true} className={classes.messagesContainer}>
                {messageList.map((msg: ChatMessage, idx) => (
                    <ListItem key={idx} style={{ wordBreak: "break-all" }}>
                        <span
                            style={{
                                color: msg.color,
                                marginRight: "0.5rem",
                                width: "20%",
                            }}
                        >
                            {msg.username}
                        </span>
                        <span
                            style={{
                                width: "80%",
                                color:
                                    msg.username === "BOT"
                                        ? msg.message.includes("joined") ||
                                          msg.message.includes("correctly")
                                            ? "green"
                                            : "red"
                                        : "inherit",
                            }}
                        >
                            {msg.message}
                        </span>
                    </ListItem>
                ))}
            </List>
            <div className={classes.inputContainer}>
                <FormControl style={{ width: "100%" }} variant="filled">
                    <InputLabel htmlFor="chat-message-input-box">
                        Type you message
                    </InputLabel>
                    <FilledInput
                        id="chat-message-input-box"
                        fullWidth
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                    />
                </FormControl>
            </div>
        </div>
    );
};

export default Chat;
