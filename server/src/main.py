# /media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server/env/bin/python3

import os
from sockets.mainSockets import get_bot_message, get_room
from helpers.colors import COLORS
from config.Config import Colors, GameNames, SocketEvents
from helpers.printHelper import new_line_print
import sys

from fastapi import FastAPI
import socketio

from routes import userRoutes

from fastapi.middleware.cors import CORSMiddleware
import random


BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, BASE_DIR)

fast_app = FastAPI(debug=True)

fast_app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fast_app.include_router(userRoutes.userRouter, prefix="/api/user", tags=["user"])


socket = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)

app = socketio.ASGIApp(
    socketio_server=socket, other_asgi_app=fast_app, socketio_path="/socket.io/"
)

"""  
{
    game_name: {
        room_id: [
            user_1_username, user_2_username,....
        ]
    }
}
"""
ROOMS: "dict[str, dict[str, list[str]]]" = {
    GameNames.CHESS: {},
    GameNames.CHECKERS: {},
    GameNames.SKETCHIO: {},
}

"""  
{
    socket_id: {
        username: username,
        room_id: room_id,
        game_name: game_name
    }
}
"""
socket_id_to_username: "dict[str, dict[str, str]]" = {}


@socket.event
def connect(socket_id, data):
    new_line_print(f"socket {socket_id} connected", num_new_lines=1)


@socket.event
async def disconnect(socket_id):
    socket_info = socket_id_to_username[socket_id]
    username = socket_info["username"]
    game_name = socket_info["game_name"]
    room_id = socket_info["room_id"]

    message = get_bot_message(username, False)

    # delete the user from the room
    ROOMS[game_name][room_id] = list(
        filter(
            lambda x: x != username,
            ROOMS[game_name][room_id],
        )
    )

    # free up some memory
    del socket_id_to_username[socket_id]

    await socket.emit(
        SocketEvents.RECEIVE_CHAT_MESSAGE,
        message,
        to=room_id,
        skip_sid=socket_id,
    )


@socket.event
async def userPlayedAMove(socket_id, move: "dict[str, list[int]]"):
    room_to_send_to = get_room(socket, socket_id)

    await socket.emit(
        SocketEvents.OPPONENT_PLAYED_A_MOVE,
        move,
        skip_sid=socket_id,
        to=room_to_send_to,
    )


@socket.event
async def joinRoom(socket_id, data: "dict[str, str]"):
    # extract the game name from the room_id
    # room_id = <gameName>_<actualRoomId>

    game_name, room_id = data["roomId"].split("_")
    username = data["username"]

    socket_id_to_username[socket_id] = {
        "username": username,
        "game_name": game_name,
        "room_id": room_id,
    }

    socket.enter_room(socket_id, room_id)

    random_chat_color = COLORS[random.randint(0, len(COLORS) - 1)]

    # add the new socket to the room
    if not ROOMS[game_name].get(room_id):
        # newly created room, only one player's in it
        ROOMS[game_name][room_id] = [username]

    else:
        # someone's already in the room so append the next player
        ROOMS[game_name][room_id].append(username)

    if game_name == GameNames.CHESS:
        if len(ROOMS[game_name][room_id]) == 1:
            # first player in a chess room, assign them the color white
            color = Colors.WHITE

        else:
            # one player is already in the room, so assign the color black
            color = Colors.BLACK

            # send a list of the two users who are playeing the game
            await socket.emit(
                SocketEvents.CHESS_PLAYER_2_JOINED,
                {"users": ROOMS[game_name][room_id]},
                to=room_id,
            )

        await socket.emit(
            SocketEvents.CHESS_COLOR_SELECTED,
            {"color": color, "chatColor": random_chat_color},
            to=socket_id,
        )

    elif game_name == GameNames.CHECKERS:
        if len(ROOMS[game_name][room_id]) == 1:
            # first player in a chess room, assign them the color white
            color = Colors.WHITE

        else:
            # one player is already in the room, so assign the color black
            color = Colors.RED

            # send a list of the two users who are playeing the game
            await socket.emit(
                SocketEvents.CHECKERS_PLAYER_2_JOINED,
                {"users": ROOMS[game_name][room_id]},
                to=room_id,
            )

        await socket.emit(
            SocketEvents.CHECKERS_COLOR_SELECTED,
            {"color": color, "chatColor": random_chat_color},
            to=socket_id,
        )

    # emit a chat message from a bot
    await socket.emit(
        SocketEvents.RECEIVE_CHAT_MESSAGE,
        get_bot_message(username, connected=True),
        to=room_id,
        skip_sid=socket_id,
    )


@socket.event
async def sentChatMessage(socket_id, data):
    """
    data = {
        username: string;
        color: string;
        message: string;
    }
    """
    room_to_send_to = get_room(socket, socket_id)

    await socket.emit(
        SocketEvents.RECEIVE_CHAT_MESSAGE,
        data,
        room=room_to_send_to,
        skip_sid=socket_id,
    )


@socket.event
async def checkersGameOver(socket_id, gameOverData):
    room_to_send_to = get_room(socket, socket_id)

    await socket.emit(
        SocketEvents.CHECKERS_GAME_OVER,
        gameOverData,
        room=room_to_send_to,
        skip_sid=socket_id,
    )


@socket.event
async def beganPath(socket_id, data):
    room_to_send_to = get_room(socket, socket_id)

    await socket.emit(
        SocketEvents.BEGAN_PATH,
        data,
        room=room_to_send_to,
        skip_sid=socket_id,
    )


@socket.event
async def strokedPath(socket_id, data):
    room_to_send_to = get_room(socket, socket_id)

    await socket.emit(
        SocketEvents.STROKED_PATH,
        data,
        room=room_to_send_to,
        skip_sid=socket_id,
    )


@socket.event
async def startedFilling(socket_id, data):
    room_to_send_to = get_room(socket, socket_id)

    await socket.emit(
        SocketEvents.STARTED_FILLING,
        data,
        room=room_to_send_to,
        skip_sid=socket_id,
    )


@fast_app.get("/")
def read_root():
    return {"Hello": "World"}
