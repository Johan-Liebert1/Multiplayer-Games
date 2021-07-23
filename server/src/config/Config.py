import os


class Config:
    # POSTGRES_URI = os.getenv("POSTGRES_URI")
    POSTGRES_URI = "postgresql://postgres:123456@localhost:5432/multiplayer_games"
    JWT_SECRET = "KALJ09293842093UIOFHJAJFKH2983482"
    JWT_ALGORITHM = "HS256"


class SocketConfig:
    OPPONENT_PLAYED_A_MOVE = "opponentPlayedAMove"
