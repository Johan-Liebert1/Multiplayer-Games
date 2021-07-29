from sqlalchemy import Integer
from sqlalchemy.sql.schema import Column, ForeignKey

from ..connection import Base

from db.models.User import UserModel


class CheckersGames(Base):
    __tablename__ = "checkers_games"

    game_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(ForeignKey(UserModel.id))
    games_started = Column(Integer, nullable=False, default=0)
    games_won = Column(Integer, nullable=False, default=0)
    games_lost = Column(Integer, nullable=False, default=0)
    games_drawn = Column(Integer, nullable=False, default=0)
