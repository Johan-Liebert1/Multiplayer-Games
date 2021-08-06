# fast-api stuff
from fastapi import APIRouter, Request
from fastapi.param_functions import Depends


# sqlalchemy
from sqlalchemy.orm.session import Session

# helpers
from helpers.printHelper import new_line_print
from helpers.returnHelpers import default_response
from helpers.serializers import serialize
from helpers.decorators import login_required, superadmin_required

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
@login_required
@superadmin_required
def get_all_users(request: Request, db: Session = Depends(get_db)):
    all_users = db.query(UserModel).all()

    serialized_users = serialize(all_users)

    return {"success": True, "all_users": serialized_users}


@user_router.post("/register")
def user_register_handler(details: UserCreateRequest, db: Session = Depends(get_db)):
    if len(details.username.strip()) == 0:
        return default_response(False, "Username cannot be empty")

    # username should be unique
    user_exists = db.query(UserModel).filter(UserModel.username == details.username)

    if user_exists.count() > 0:
        return default_response(
            False,
            f"User with username {details.username} already exists",
        )

    if len(details.password.strip()) == 0:
        return default_response(False, "Password cannot be empty")

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
        db.commit()  # comitting so that a ForeignKey exists for the next two tables

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
    try:
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
            {
                "id": user.id,
                "username": user.username,
                "isSuperAdmin": user.isSuperAdmin,
            },
            Config.JWT_SECRET,
            algorithm=Config.JWT_ALGORITHM,
        )

        serialized_user = serialize([user])[0]
    except Exception as e:
        new_line_print(e)

    return {"success": True, "user": {"token": token, **serialized_user}}


@user_router.get("/{user_id}")
@login_required
def get_user_info(user_id: int, request: Request, db: Session = Depends(get_db)):
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

    if len(q) == 0:
        return default_response(False, f"User with id {user_id} not found")

    serialized = serialize(q[0])

    # don't allow random users to access other user's info, except if it's a superadmin
    found_user_id = serialized[0].get("id")

    # added by the @login_required decorator
    requesting_user_id = request.state.user.get("id")

    requesting_user = (
        db.query(UserModel).filter(UserModel.id == requesting_user_id).first()
    )

    if not requesting_user:
        return default_response(False, "Not Authorized")

    if found_user_id != requesting_user_id and not requesting_user.isSuperAdmin:
        """
        A user who is not the superadmin is trying to access someone else's profile,
        don't allow it
        """
        return default_response(
            False, "You are not Authroised to access this information"
        )

    return {"info": serialized, "list_order": ["chess", "checkers"]}


@user_router.put("/editdetails")
@login_required
def edit_user_details(
    details: UserCreateRequest, request: Request, db: Session = Depends(get_db)
):
    user = request.state.user

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

    try:
        db.commit()
        return default_response(True, "Successfully updated user details")
    except:
        return default_response(False, "Details updation Failed")
