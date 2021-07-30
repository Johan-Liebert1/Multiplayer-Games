from sqlalchemy import Integer
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import String

from ..connection import Base

from db.models.User import UserModel


class ChessGames(Base):
    __tablename__ = "chess_games"

    game_id = Column(Integer, autoincrement=True, primary_key=True)
    username = Column(String, ForeignKey(UserModel.username))
    games_started = Column(Integer, nullable=False, default=0)
    games_won = Column(Integer, nullable=False, default=0)
    games_lost = Column(Integer, nullable=False, default=0)
    games_drawn = Column(Integer, nullable=False, default=0)
