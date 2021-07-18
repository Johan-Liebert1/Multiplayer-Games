import os


class Config:
    POSTGRES_URI = os.getenv("POSTGRES_URI")
