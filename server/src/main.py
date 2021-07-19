# /media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server/env/bin/python3

import os
import sys

from fastapi import FastAPI

from routes import userRoutes

from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, BASE_DIR)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userRoutes.userRouter, prefix="/api/user", tags=["user"])


@app.get("/")
def read_root():
    return {"Hello": "World"}
