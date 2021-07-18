from pydantic import BaseModel


class UserCreateRequest(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str
    email: str
