# fast-api stuff
from typing import Union
from fastapi import APIRouter, Request
from fastapi.param_functions import Depends
from sqlalchemy.sql.expression import or_
from schemas.schemas import GameDetailsUpdateRequest, SaveGameDetails

# sqlalchemy
from sqlalchemy.orm.session import Session

# models
from db.models.ChessGames import ChessGames
from db.models.CheckersGames import CheckersGames
from db.models.SingleChessGame import SingleChessGame
from db.models.SingleCheckersGame import SingleCheckersGame

# db
from db.connection import get_db

# helpers
from helpers.returnHelpers import default_response
from helpers.serializers import serialize
from helpers.printHelper import new_line_print
from helpers.decorators import login_required


games_router = APIRouter()


@games_router.get("/{username}")
@login_required
def get_user_games_info(username: str, request: Request, db: Session = Depends(get_db)):
    chess_info = db.query(ChessGames).filter(ChessGames.username == username).first()
    checkers_info = (
        db.query(CheckersGames).filter(CheckersGames.username == username).first()
    )

    if not chess_info or not checkers_info:
        return default_response(False, f"Data for {username} not found")

    chess_info = serialize([chess_info])
    checkers_info = serialize([checkers_info])

    return {
        "success": True,
        "chess_info": chess_info[0],
        "checkers_info": checkers_info[0],
    }


def update_model_details(
    model: Union[ChessGames, CheckersGames],
    update_details: GameDetailsUpdateRequest,
    username: int,
    db: Session,
):
    user_game_model = db.query(model).filter(model.username == username).first()

    if update_details.started:
        user_game_model.games_started += 1

    elif update_details.won:
        user_game_model.games_won += 1

    elif update_details.lost:
        user_game_model.games_lost += 1

    elif update_details.drawn:
        user_game_model.games_drawn += 1

    db.commit()


@games_router.post("/chess/savegame")
@login_required
def save_chess_game(
    details: SaveGameDetails, request: Request, db: Session = Depends(get_db)
):
    try:
        new_game = SingleChessGame(
            player1=details.player1,
            player2=details.player2,
            moves=details.moves,
        )

        db.add(new_game)

        db.commit()

        serialized_game = serialize([new_game])[0]

        return {"success": True, "data": serialized_game}

    except Exception as e:
        new_line_print(e)


@games_router.post("/checkers/savegame")
@login_required
def save_chess_game(
    details: SaveGameDetails, request: Request, db: Session = Depends(get_db)
):
    new_game = SingleCheckersGame(
        player1=details.player1,
        player2=details.player2,
        moves=details.moves,
    )

    db.add(new_game)

    db.commit()

    serialized_game = serialize([new_game])[0]

    return {"success": True, "data": serialized_game}


@games_router.get("/chess/{username}")
@login_required
def get_all_chess_games_for_user(
    username: str,
    request: Request,
    db: Session = Depends(get_db),
):
    query = (
        db.query(SingleChessGame)
        .filter(
            or_(
                SingleChessGame.player1 == username, SingleChessGame.player2 == username
            )
        )
        .all()
    )

    serialized = serialize(query)

    return {"success": True, "games": serialized}


@games_router.get("/checkers/{username}")
@login_required
def get_all_checkers_games_for_user(
    username: str,
    request: Request,
    db: Session = Depends(get_db),
):
    query = (
        db.query(SingleCheckersGame)
        .filter(
            or_(
                SingleCheckersGame.player1 == username,
                SingleCheckersGame.player2 == username,
            )
        )
        .all()
    )

    serialized = serialize(query)

    return {"success": True, "games": serialized}


@games_router.post("/chess/{username}")
@login_required
def update_chess_details(
    username: str,
    update_details: GameDetailsUpdateRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        new_line_print(f"updating chess for {username}, {update_details}")

        update_model_details(ChessGames, update_details, username, db)

        return default_response(True, "Updated successfully")
    except Exception as e:
        new_line_print(e)


@games_router.post("/checkers/{username}")
@login_required
def update_checkers_details(
    username: str,
    update_details: GameDetailsUpdateRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    update_model_details(CheckersGames, update_details, username, db)

    return default_response(True, "Updated successfully")
