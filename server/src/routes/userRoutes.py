# fast-api stuff
from fastapi import APIRouter
from fastapi.param_functions import Depends

# sqlalchemy
from sqlalchemy.orm.session import Session

# helpers
from helpers.printHelper import new_line_print
from helpers.returnHelpers import default_response
from helpers.serializers import serialize

# db models
from db.connection import get_db
from schemas.schemas import UserCreateRequest, UserLoginRequest
from db.models.User import UserModel

from config.Config import Config

import bcrypt
import jwt

userRouter = APIRouter()


@userRouter.get("/all")
def get_all_users(db: Session = Depends(get_db)):
    all_users = db.query(UserModel).all()

    serialized_users = serialize(all_users)

    return {"success": True, "all_users": serialized_users}


@userRouter.post("/register")
def user_register_handler(details: UserCreateRequest, db: Session = Depends(get_db)):
    # username should be unique
    user_exists = db.query(UserModel).filter(UserModel.username == details.username)

    if user_exists.count() > 0:
        return default_response(
            False,
            f"User with username {details.username} already exists",
        )

    salt = bcrypt.gensalt()
    password = bcrypt.hashpw(details.password.encode("utf-8"), salt)

    try:
        to_create = UserModel(
            username=details.username,
            password=password,
            salt=salt,
            firstName=details.firstName,
            lastName=details.lastName,
            email=details.email,
        )

        db.add(to_create)
        db.commit()

        user = serialize([to_create])

        return {
            "success": True,
            "user": user[0],
            "message": "User Registered successfully",
        }
    except Exception as e:
        raise e


@userRouter.post("/login")
def user_login_handler(details: UserLoginRequest, db: Session = Depends(get_db)):
    user_exists = db.query(UserModel).filter(UserModel.username == details.username)

    if user_exists.count() == 0:
        # user does not exist
        return default_response(
            False, f"User with username {details.username} is not registered"
        )

    user: UserModel = user_exists[0]

    """
    take the user input password and hash it with the same salt use used to 
    hash the original password. Then we compare hashes to see if they're equal
    """
    password = details.password.encode("utf-8")
    hashed_input_password: bytes = bcrypt.hashpw(password, user.salt)

    if hashed_input_password != user.password:
        return default_response(False, "Invalid Password")

    token = jwt.encode(
        {"id": user.id, "username": user.username},
        Config.JWT_SECRET,
        algorithm=Config.JWT_ALGORITHM,
    )

    return {"success": True, "token": token}
