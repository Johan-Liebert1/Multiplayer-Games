# /media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server/env/bin/python3

import os
from config.Config import SocketConfig
from helpers.printHelper import new_line_print
import sys
from typing import List

from fastapi import FastAPI
import socketio

from routes import userRoutes

from fastapi.middleware.cors import CORSMiddleware


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


@socket.event
def connect(socket_id, data):
    new_line_print(f"socket {socket_id} connected", num_new_lines=1)


@socket.event
async def playedAMove(socket_id, move: "dict[str, List[int]]"):
    new_line_print(f"emitting to {socket_id}, move = {move}")
    await socket.emit(SocketConfig.OPPONENT_PLAYED_A_MOVE, move, skip_sid=socket_id)


@fast_app.get("/")
def read_root():
    return {"Hello": "World"}
