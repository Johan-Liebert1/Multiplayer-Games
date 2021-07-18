from sqlalchemy import Integer, String
from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import LargeBinary

from ..connection import Base


class UserModel(Base):
    __tablename__ = "user_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False)
    password = Column(LargeBinary, nullable=False)
    salt = Column(LargeBinary, nullable=False)
    firstName = Column(String(50), default="")
    lastName = Column(String(50), default="")
    email = Column(String(100), default="")
    profilePictureUrl = Column(String(250), default="")
    profileBannerUrl = Column(String(250), default="")
