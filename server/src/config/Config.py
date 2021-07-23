import os


class Config:
    # POSTGRES_URI = os.getenv("POSTGRES_URI")
    POSTGRES_URI = "postgresql://postgres:123456@localhost:5432/multiplayer_games"
    JWT_SECRET = "KALJ09293842093UIOFHJAJFKH2983482"
    JWT_ALGORITHM = "HS256"


class SocketEvents:
    OPPONENT_PLAYED_A_MOVE = "OPPONENT_PLAYED_A_MOVE"
    CHESS_COLOR_SELECTED = "CHESS_COLOR_SELECTED"
    CHECKERS_COLOR_SELECTED = "CHECKERS_COLOR_SELECTED"


class GameNames:
    CHESS = "chess"
    CHECKERS = "checkers"
    SKETCHIO = "sketchio"


class Colors:
    WHITE = "white"
    BLACK = "black"
    RED = "red"
