from fastapi import APIRouter, Request
from fastapi.param_functions import Depends

from helpers.awsHelpers import upload_file
from helpers.decorators import login_required

from sqlalchemy.orm.session import Session

from db.connection import get_db
from db.models.User import UserModel


upload_router = APIRouter()


@upload_router.post("/profile-picture")
@login_required
async def upload_new_profile_picture(request: Request, db: Session = Depends(get_db)):
    user: "dict[str, str]" = request.state.user

    user_model = db.query(UserModel).filter(UserModel.id == user["id"]).first()

    file_details = await request.form()

    file_to_upload = file_details.get("myFile")

    s3_url = upload_file(
        file_to_upload.file, file_to_upload.filename, user_model.username
    )

    user_model.profilePictureUrl = s3_url

    db.commit()

    return {"success": True, "profilePictureUrl": s3_url}
