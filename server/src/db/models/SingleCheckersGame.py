import datetime

from sqlalchemy import Integer
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import DateTime, String, Text

from ..connection import Base

from db.models.User import UserModel


class SingleCheckersGame(Base):
    __tablename__ = "single_checkers_game"

    game_id = Column(Integer, autoincrement=True, primary_key=True)
    player1 = Column(String(50), ForeignKey(UserModel.username))
    player2 = Column(String(50), ForeignKey(UserModel.username))
    moves = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
