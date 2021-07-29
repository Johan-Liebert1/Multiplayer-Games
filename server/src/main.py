import os
from helpers.printHelper import new_line_print
import sys

from fastapi import FastAPI
import socketio

from routes.userRoutes import user_router
from routes.gameDetailsRoutes import games_router


from fastapi.middleware.cors import CORSMiddleware

from sockets.mainSockets import SocketHandler

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

fast_app.include_router(user_router, prefix="/api/user", tags=["user"])
fast_app.include_router(games_router, prefix="/api/games", tags=["games"])


socket = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)

app = socketio.ASGIApp(
    socketio_server=socket, other_asgi_app=fast_app, socketio_path="/socket.io/"
)

socket_handler = SocketHandler(socket)


@socket.event
def connect(socket_id, data):
    new_line_print(f"socket {socket_id} connected", num_new_lines=1)


@socket.event
async def disconnect(socket_id):
    await socket_handler.disconnect(socket_id)


@socket.event
async def userPlayedAMove(socket_id, move: "dict[str, list[int]]"):
    await socket_handler.userPlayedAMove(socket_id, move)


@socket.event
async def joinRoom(socket_id, data: "dict[str, str]"):
    await socket_handler.joinRoom(socket_id, data)


@socket.event
async def sentChatMessage(socket_id, data):
    await socket_handler.sentChatMessage(socket_id, data)


@socket.event
async def checkersGameOver(socket_id, gameOverData):
    await socket_handler.checkersGameOver(socket_id, gameOverData)


@socket.event
async def startSketchioGame(socket_id, data):
    await socket_handler.startSketchioGame(socket_id, data)


@socket.event
async def beganPath(socket_id, data):
    await socket_handler.beganPath(socket_id, data)


@socket.event
async def strokedPath(socket_id, data):
    await socket_handler.strokedPath(socket_id, data)


@socket.event
async def startedFilling(socket_id, data):
    await socket_handler.startedFilling(socket_id, data)


@fast_app.get("/")
def read_root():
    return {"Hello": "World"}
