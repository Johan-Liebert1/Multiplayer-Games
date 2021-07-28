from functools import wraps
from typing import Union
from helpers.printHelper import new_line_print
from config.Config import Config
import jwt
from helpers.returnHelpers import default_response
from schemas.schemas import UserCreateRequest
from fastapi import Request


def login_required(function):
    # def wrapper(*args, **kwargs):
    @wraps(function)
    def wrapper(details: Union[UserCreateRequest or None], request: Request, db):

        if not request.headers.get("Authorization"):
            return default_response(False, "Token not found")

        token_type, token = request.headers["Authorization"].split(" ")

        if token_type != "Bearer":
            return default_response(False, "Bearer token not found")

        user: "dict[str, str]" = jwt.decode(
            token, Config.JWT_SECRET, [Config.JWT_ALGORITHM]
        )

        details.__setattr__("user", user)

        return function(details, request, db)

    return wrapper
