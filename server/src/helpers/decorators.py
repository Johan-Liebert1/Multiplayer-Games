from functools import wraps
from typing import Union

from fastapi import Request
import jwt

from config.Config import Config

from helpers.returnHelpers import default_response
from helpers.printHelper import new_line_print


def check_for_token(
    request: Request, details
) -> "tuple[bool, Union[bool, dict[str, str]]]":
    if not request.headers.get("Authorization"):
        return True, default_response(False, "Token not found")

    token_type, token = request.headers["Authorization"].split(" ")

    if token_type != "Bearer":
        return True, default_response(False, "Bearer token not found")

    user: "dict[str, str]" = jwt.decode(
        token, Config.JWT_SECRET, [Config.JWT_ALGORITHM]
    )

    # setting the user attribute in the request object so that
    # the handler function has the details of the user
    request.state.__setattr__("user", user)

    if details:
        details.__setattr__("user", user)

    return False, False


def login_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        details = kwargs.get("details")
        request: Request = kwargs["request"]

        bad_request, response = check_for_token(request, details)

        if bad_request:
            return response

        return function(*args, **kwargs)

    return wrapper


def async_login_required(function):
    @wraps(function)
    async def wrapper(*args, **kwargs):
        details = kwargs.get("details")
        request: Request = kwargs["request"]

        bad_request, response = check_for_token(request, details)
        new_line_print(bad_request, response)

        if bad_request:
            return response

        return await function(*args, **kwargs)

    return wrapper


def superadmin_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        request: Request = kwargs["request"]
        if not request.state.user["isSuperAdmin"]:
            return default_response(
                False, "Only superadmin has the privileges to perform this action"
            )

        return function(*args, **kwargs)

    return wrapper
