from typing import Dict, List, Union
from pydantic import BaseModel


class UserCreateRequest(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str
    email: str
    user: Union[Dict[str, str], None]


class UserLoginRequest(BaseModel):
    username: str
    password: str
    user: Union[Dict[str, str], None]


class GameDetailsUpdateRequest(BaseModel):
    won: bool
    lost: bool
    drawn: bool
    started: bool
    user: Union[Dict[str, str], None]


class SaveGameDetails(BaseModel):
    player1: str
    player2: str
    moves: str
    user: Union[Dict[str, str], None]
