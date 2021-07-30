# fast-api stuff
from fastapi import APIRouter, Request
from fastapi.param_functions import Depends


# sqlalchemy
from sqlalchemy.orm.session import Session

# helpers
from helpers.printHelper import new_line_print
from helpers.returnHelpers import default_response
from helpers.serializers import serialize
from helpers.decorators import login_required

# db models
from db.connection import get_db
from db.models.User import UserModel
from db.models.CheckersGames import CheckersGames
from db.models.ChessGames import ChessGames

from config.Config import Config
from schemas.schemas import UserCreateRequest, UserLoginRequest

import bcrypt
import jwt

user_router = APIRouter()


@user_router.get("/all")
def get_all_users(db: Session = Depends(get_db)):
    all_users = db.query(UserModel).all()

    serialized_users = serialize(all_users)

    return {"success": True, "all_users": serialized_users}


@user_router.post("/register")
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

        to_create_chess = ChessGames(
            username=details.username,
            games_started=0,
            games_won=0,
            games_lost=0,
            games_drawn=0,
        )

        to_create_checkers = CheckersGames(
            username=details.username,
            games_started=0,
            games_won=0,
            games_lost=0,
            games_drawn=0,
        )

        db.add(to_create)
        db.add(to_create_chess)
        db.add(to_create_checkers)
        db.commit()

        user = serialize([to_create])

        return {
            "success": True,
            "user": user[0],
            "message": "User Registered successfully",
        }
    except Exception as e:
        raise e


@user_router.post("/login")
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

    serialized_user = serialize([user])[0]

    return {"success": True, "user": {"token": token, **serialized_user}}


@user_router.get("/{user_id}")
def get_user_info(user_id: str, db: Session = Depends(get_db)):
    q = (
        db.query(UserModel, ChessGames, CheckersGames)
        .filter(UserModel.id == user_id)
        .filter(
            ChessGames.username == UserModel.username,
        )
        .filter(
            CheckersGames.username == UserModel.username,
        )
        .all()
    )

    new_line_print(q)

    serialized = serialize(q[0])

    return {"info": serialized, "list_order": ["chess", "checkers"]}


@user_router.put("/editdetails")
@login_required
def edit_user_details(
    details: UserCreateRequest, request: Request, db: Session = Depends(get_db)
):
    user = details.user

    user_model = db.query(UserModel).filter(UserModel.id == user["id"]).first()

    if not user_model:
        return default_response(False, "User does not exist")

    user_model.username = details.username or user_model.username
    user_model.firstName = details.firstName or user_model.firstName
    user_model.lastName = details.lastName or user_model.lastName
    user_model.email = details.email or user_model.email

    if len(details.password) > 0:
        salt = user_model.salt
        password = bcrypt.hashpw(details.password.encode("utf-8"), salt)
        user_model.password = password

    db.commit()

    return default_response(True, "Updated User")
