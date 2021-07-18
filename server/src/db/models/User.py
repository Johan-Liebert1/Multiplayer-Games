from sqlalchemy import Integer, String
from sqlalchemy.sql.schema import Column

from ..connection import Base


class UserModel(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    firstName = Column(String, default="")
    lastName = Column(String, default="")
    email = Column(String, default="")
