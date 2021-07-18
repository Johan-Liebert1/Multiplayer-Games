from pydantic import BaseModel


class UserCreateRequest(BaseModel):
    name: str
