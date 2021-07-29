# fast-api stuff
from typing import Union
from fastapi import APIRouter, Request
from fastapi.param_functions import Depends
from schemas.schemas import GameDetailsUpdateRequest

# sqlalchemy
from sqlalchemy.orm.session import Session

# models
from db.models.ChessGames import ChessGames
from db.models.CheckersGames import CheckersGames

# db
from db.connection import get_db

# helpers
from helpers.returnHelpers import default_response

games_router = APIRouter()


def update_model_details(
    model: Union[ChessGames, CheckersGames],
    update_details: GameDetailsUpdateRequest,
    user_id: int,
    db: Session,
):
    user_game_model = db.query(model).filter(model.user_id == user_id).first()

    if not user_game_model:
        # create a ChessGames model for the user
        to_create = model(
            user_id=user_id,
            games_started=0,
            games_won=0,
            games_lost=0,
            games_drawn=0,
        )
        db.add(to_create)

        user_game_model = to_create

    if update_details.started:
        user_game_model.games_started += 1

    elif update_details.won:
        user_game_model.games_won += 1

    elif update_details.lost:
        user_game_model.games_lost += 1

    elif update_details.drawn:
        user_game_model.games_drawn += 1

    db.commit()


@games_router.post("/chess/{user_id}")
def update_chess_details(
    user_id: str,
    update_details: GameDetailsUpdateRequest,
    db: Session = Depends(get_db),
):
    update_model_details(ChessGames, update_details, user_id, db)

    return default_response(True, "Updated successfully")


@games_router.post("/checkers/{user_id}")
def update_checkers_details(
    user_id: str,
    update_details: GameDetailsUpdateRequest,
    db: Session = Depends(get_db),
):
    update_model_details(CheckersGames, update_details, user_id, db)

    return default_response(True, "Updated successfully")