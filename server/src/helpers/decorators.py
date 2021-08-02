from functools import wraps
from typing import Union
from helpers.printHelper import new_line_print
from config.Config import Config
import jwt
from helpers.returnHelpers import default_response
from schemas.schemas import UserCreateRequest
from fastapi import Request


def login_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        # def wrapper(details: Union[UserCreateRequest or None], request: Request, db):
        new_line_print(f"{args}, {kwargs}")

        details = kwargs.get("details")

        request: Request = kwargs["request"]

        if not request.headers.get("Authorization"):
            return default_response(False, "Token not found")

        new_line_print(request.headers.get("Authorization"))

        token_type, token = request.headers["Authorization"].split(" ")

        if token_type != "Bearer":
            return default_response(False, "Bearer token not found")

        user: "dict[str, str]" = jwt.decode(
            token, Config.JWT_SECRET, [Config.JWT_ALGORITHM]
        )

        # setting the user attribute in the request object so that
        # the handler function has the details of the user
        request.state.__setattr__("user", user)

        if details:
            details.__setattr__("user", user)

        return function(*args, **kwargs)

    return wrapper
