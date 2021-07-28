from typing import Dict, Union
from pydantic import BaseModel


class UserCreateRequest(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str
    email: str
    user: Union[Dict[str,str], None]


class UserLoginRequest(BaseModel):
    username: str
    password: str
