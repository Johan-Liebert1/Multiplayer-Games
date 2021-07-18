from typing import List
from fastapi import APIRouter
from fastapi.param_functions import Depends

from sqlalchemy.orm.session import Session
from sqlalchemy.orm.query import Query

from db.connection import get_db
from schemas.schemas import UserCreateRequest
from db.models.User import UserModel

userRouter = APIRouter()


def serialize(objects: List[Query]) -> "List[dict[str, str]]":
    """
    Takes in a list of SQLAlchemy query objects, and returns a JSONified list
    """
    new_list: List[dict[str, str]] = []
    custom_attr_names = ["salt", "password", "registry", "metadata"]

    # get a list of query objects
    for q_obj in objects:
        d: dict[str, str] = {}

        for attr_name in dir(q_obj):
            if not attr_name.startswith("_") and attr_name not in custom_attr_names:
                d[attr_name] = q_obj.__getattribute__(attr_name)

        new_list.append(d)

    return new_list


@userRouter.get("/all")
def get_all_users(db: Session = Depends(get_db)):
    all_users = db.query(UserModel).all()

    serialized_users = serialize(all_users)

    return {"success": True, "all_users": serialized_users}


@userRouter.post("/register")
def read_item(details: UserCreateRequest, db: Session = Depends(get_db)):
    try:
        to_create = UserModel(
            username=details.username,
            password=details.password,
            salt="",
            firstName=details.firstName,
            lastName=details.lastName,
            email=details.email,
        )

        db.add(to_create)
        db.commit()

        return {
            "success": True,
            "user": details,
            "message": "User Registered successfully",
        }

    except:
        return {"success": False, "message": "Sorry, some error occured"}
