# /media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server/env/bin/python3

import os
from sockets.mainSockets import get_bot_message
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


socket = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)

app = socketio.ASGIApp(
    socketio_server=socket, other_asgi_app=fast_app, socketio_path="/socket.io/"
)


@socket.event
def connect(socket_id, data):
    new_line_print(f"socket {socket_id} connected", num_new_lines=1)


@socket.event
async def userPlayedAMove(socket_id, move: "dict[str, list[int]]"):
    new_line_print(
        f"emitting to {socket_id}, move = {move}, rooms={socket.rooms(socket_id)}", 1
    )

    for room in socket.rooms(socket_id):
        if room != socket_id:
            room_to_send_to: str = room
            break

    # socket.rooms() returns all the rooms that the current socket is in
    # first room is always the socket_id
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
    socket.enter_room(socket_id, room_id)

    random_chat_color = COLORS[random.randint(0, len(COLORS) - 1)]

    # add the new socket to the room
    if not ROOMS[game_name].get(room_id):
        # newly created room, only one player's in it
        ROOMS[game_name][room_id] = ["player1"]

    else:
        # someone's already in the room so append the next player
        ROOMS[game_name][room_id].append("player2")

    if game_name == GameNames.CHESS:
        if len(ROOMS[game_name][room_id]) == 1:
            # first player in a chess room, assign them the color white
            color = Colors.WHITE

        else:
            # one player is already in the room, so assign the color black
            color = Colors.BLACK

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

        await socket.emit(
            SocketEvents.CHECKERS_COLOR_SELECTED,
            {"color": color, "chatColor": random_chat_color},
            to=socket_id,
        )

    new_line_print("sending bot message yayay")
    # emit a chat message from a bot
    await socket.emit(
        SocketEvents.RECEIVE_CHAT_MESSAGE,
        get_bot_message("username", connected=True),
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
    for room in socket.rooms(socket_id):
        if room != socket_id:
            room_to_send_to = room
            break

    await socket.emit(
        SocketEvents.RECEIVE_CHAT_MESSAGE,
        data,
        room=room_to_send_to,
        skip_sid=socket_id,
    )


@fast_app.get("/")
def read_root():
    return {"Hello": "World"}
