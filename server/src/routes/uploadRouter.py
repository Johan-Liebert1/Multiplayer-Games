from fastapi import APIRouter, Request
from fastapi.param_functions import Depends

from helpers.awsHelpers import upload_file
from helpers.decorators import async_login_required
from helpers.printHelper import new_line_print
from helpers.returnHelpers import default_response

from sqlalchemy.orm.session import Session

from db.connection import get_db
from db.models.User import UserModel


upload_router = APIRouter()


@upload_router.post("/profile-picture")
@async_login_required
async def upload_new_profile_picture(request: Request, db: Session = Depends(get_db)):
    try:
        user: "dict[str, str]" = request.state.user

        user_model = db.query(UserModel).filter(UserModel.id == user["id"]).first()

        file_details = await request.form()

        file_to_upload = file_details.get("myFile")

        s3_url = upload_file(
            file_to_upload.file, file_to_upload.filename, user_model.username
        )

        if not s3_url:
            return default_response(False, "Sorry something went wrong")

        new_line_print(f"{s3_url=}")

        user_model.profilePictureUrl = s3_url

        db.commit()

        return {"success": True, "profilePictureUrl": s3_url}

    except Exception as e:
        new_line_print(e)
        return default_response(False, "Upload Failed")
