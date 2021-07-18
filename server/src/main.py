# /media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server/env/bin/python3

import sys

from fastapi import FastAPI
from typing import Optional

# sys.path.append("/media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server")

from db.connection import engine


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
