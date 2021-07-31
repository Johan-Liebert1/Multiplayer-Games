import datetime

from sqlalchemy import Integer
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import DateTime, String, Text

from ..connection import Base

from db.models.User import UserModel


class ChessGames(Base):
    __tablename__ = "chess_games"

    game_id = Column(Integer, autoincrement=True, primary_key=True)
    player1 = Column(String(50), ForeignKey(UserModel.username))
    player2 = Column(String(50), ForeignKey(UserModel.username))
    moves = Column(Text(5000))
    date = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
