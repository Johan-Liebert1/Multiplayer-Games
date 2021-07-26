export const socketEmitEvents = Object.freeze({
  USER_PLAYED_A_MOVE: "userPlayedAMove",
  JOIN_A_ROOM: "joinRoom",
  SENT_CHAT_MESSAGE: "sentChatMessage",
  CHECKERS_GAME_OVER: "checkersGameOver",
  CHESS_GAME_OVER: "chessGameOver",
  BEGAN_PATH: "beganPath",
  STROKED_PATH: "strokedPath",
  STARTED_FILLING: "startedFilling"
});

export const socketListenEvents = Object.freeze({
  OPPONENT_PLAYED_A_MOVE: "OPPONENT_PLAYED_A_MOVE",
  CHESS_COLOR_SELECTED: "CHESS_COLOR_SELECTED",
  CHECKERS_COLOR_SELECTED: "CHECKERS_COLOR_SELECTED",
  RECEIVE_CHAT_MESSAGE: "RECEIVE_CHAT_MESSAGE",
  CHECKERS_GAME_OVER: "CHECKERS_GAME_OVER",
  CHESS_GAME_OVER: "CHESS_GAME_OVER",
  CHESS_PLAYER_2_JOINED: "CHESS_PLAYER_2_JOINED",
  BEGAN_PATH: "BEGAN_PATH",
  STROKED_PATH: "STROKED_PATH",
  STARTED_FILLING: "STARTED_FILLING"
});
