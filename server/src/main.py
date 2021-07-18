# /media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server/env/bin/python3

from db.models.User import UserModel
from schemas.userSchema import UserCreateRequest

from fastapi import FastAPI, Depends
from typing import Optional

from sqlalchemy.orm import Session

# sys.path.append("/media/pragyan/Local Disk/Python/MultiplayerGamesFastAPITS/server")

from db.connection import get_db


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/user")
def read_item(details: UserCreateRequest, db: Session = Depends(get_db)):
    print(f"\n{details=}\n")
    to_create = UserModel(id=details.id, name=details.name)

    db.add(to_create)
    db.commit()

    return {"success": True, "created": {"id": to_create.id, "name": to_create.name}}
