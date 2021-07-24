export const socketEmitEvents = Object.freeze({
  USER_PLAYED_A_MOVE: "userPlayedAMove",
  JOIN_A_ROOM: "joinRoom",
  SENT_CHAT_MESSAGE: "sentChatMessage"
});

export const socketListenEvents = Object.freeze({
  OPPONENT_PLAYED_A_MOVE: "OPPONENT_PLAYED_A_MOVE",
  CHESS_COLOR_SELECTED: "CHESS_COLOR_SELECTED",
  CHECKERS_COLOR_SELECTED: "CHECKERS_COLOR_SELECTED",
  RECEIVE_CHAT_MESSAGE: "RECEIVE_CHAT_MESSAGE" // this is the name in the backend
});
