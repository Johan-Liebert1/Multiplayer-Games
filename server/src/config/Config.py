import os


class Config:
    PROD_ENV = "PROD_ENV"
    DEV_ENV = "DEV_ENV"
    ENVIRONMENT = DEV_ENV

    POSTGRES_URI = "postgresql://postgres:123456@0.0.0.0:5432/multiplayergames"
    JWT_SECRET = "KALJ09293842093UIOFHJAJFKH2983482"
    JWT_ALGORITHM = "HS256"

    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
    AWS_REGION = "s3-ap-south-1.amazonaws.com"
    S3_BASE_URL = f"https://{AWS_STORAGE_BUCKET_NAME}.{AWS_REGION}"


class SocketEvents:
    OPPONENT_PLAYED_A_MOVE = "OPPONENT_PLAYED_A_MOVE"

    # chess
    CHESS_COLOR_SELECTED = "CHESS_COLOR_SELECTED"
    CHESS_PLAYER_2_JOINED = "CHESS_PLAYER_2_JOINED"
    OPPONENT_PROMOTED_PAWN = "OPPONENT_PROMOTED_PAWN"
    CHESS_GAME_OVER = "CHESS_GAME_OVER"
    OPPONENT_CASTLED = "OPPONENT_CASTLED"

    # checkers
    CHECKERS_COLOR_SELECTED = "CHECKERS_COLOR_SELECTED"
    CHECKERS_GAME_OVER = "CHECKERS_GAME_OVER"
    CHECKERS_PLAYER_2_JOINED = "CHCKERS_PLAYER_2_JOINED"

    # sketchio
    BEGAN_PATH = "BEGAN_PATH"
    STROKED_PATH = "STROKED_PATH"
    STARTED_FILLING = "STARTED_FILLING"
    SKETCH_IO_GAME_OVER = "SKETCH_IO_GAME_OVER"
    SKETCHIO_PLAYER_JOINED = "SKETCHIO_PLAYER_JOINED"
    NEW_PAINTER_SELECTED = "NEW_PAINTER_SELECTED"

    # chat
    RECEIVE_CHAT_MESSAGE = "RECEIVE_CHAT_MESSAGE"
    USER_DISCONNECTED = "USER_DISCONNECTED"


class GameNames:
    CHESS = "chess"
    CHECKERS = "checkers"
    SKETCHIO = "sketchio"


class Colors:
    WHITE = "white"
    BLACK = "black"
    RED = "red"
    BOT_COLOR = "#00FF7F"
