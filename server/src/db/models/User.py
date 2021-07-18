from sqlalchemy import Integer, String
from sqlalchemy.sql.schema import Column

from ..connection import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String)
