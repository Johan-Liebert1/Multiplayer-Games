export const socketEmitEvents = Object.freeze({
    USER_PLAYED_A_MOVE: "userPlayedAMove",
    JOIN_A_ROOM: "joinRoom",
    SENT_CHAT_MESSAGE: "sentChatMessage",
    CHECKERS_GAME_OVER: "checkersGameOver",
    PAWN_PROMOTED: "pawnPromoted",
    CASTLED: "castled",
    CHESS_GAME_OVER: "chessGameOver",
    BEGAN_PATH: "beganPath",
    STROKED_PATH: "strokedPath",
    STARTED_FILLING: "startedFilling",
    START_SKETCHIO_GAME: "startSketchioGame",
});

export const socketListenEvents = Object.freeze({
    OPPONENT_PLAYED_A_MOVE: "OPPONENT_PLAYED_A_MOVE",

    // chess
    CHESS_COLOR_SELECTED: "CHESS_COLOR_SELECTED",
    CHESS_PLAYER_2_JOINED: "CHESS_PLAYER_2_JOINED",
    OPPONENT_PROMOTED_PAWN: "OPPONENT_PROMOTED_PAWN",
    CHESS_GAME_OVER: "CHESS_GAME_OVER",
    OPPONENT_CASTLED: "OPPONENT_CASTLED",

    // checkers
    CHECKERS_COLOR_SELECTED: "CHECKERS_COLOR_SELECTED",
    CHECKERS_GAME_OVER: "CHECKERS_GAME_OVER",
    CHECKERS_PLAYER_2_JOINED: "CHCKERS_PLAYER_2_JOINED",

    // sketchio
    BEGAN_PATH: "BEGAN_PATH",
    STROKED_PATH: "STROKED_PATH",
    STARTED_FILLING: "STARTED_FILLING",
    SKETCH_IO_GAME_OVER: "SKETCH_IO_GAME_OVER",
    SKETCHIO_PLAYER_JOINED: "SKETCHIO_PLAYER_JOINED",
    NEW_PAINTER_SELECTED: "NEW_PAINTER_SELECTED",

    // chat
    RECEIVE_CHAT_MESSAGE: "RECEIVE_CHAT_MESSAGE",
    USER_DISCONNECTED: "USER_DISCONNECTED",
});
