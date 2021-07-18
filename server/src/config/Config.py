import os


class Config:
    # POSTGRES_URI = os.getenv("POSTGRES_URI")
    POSTGRES_URI = "postgresql://postgres:123456@localhost:5432/multiplayer_games"
