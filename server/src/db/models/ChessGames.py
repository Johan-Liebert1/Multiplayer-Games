from sqlalchemy import Integer
from sqlalchemy.sql.schema import Column, ForeignKey

from ..connection import Base

from User import UserModel


class ChessGames(Base):
    __tablename__ = "chess_games"

    user_id = Column(ForeignKey(UserModel.id))
    games_won = Column(Integer, nullable=False, default=0)
    games_lost = Column(Integer, nullable=False, default=0)
    games_drawn = Column(Integer, nullable=False, default=0)
