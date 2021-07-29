from helpers.printHelper import new_line_print
import boto3
from botocore import config
from config.Config import Config
from uuid import uuid4


def upload_file(file_to_upload, file_name: str, username: str) -> str:
    """
    Uploads to S3 and returns the S3 URL for the object
    """
    try:
        uid = str(uuid4())

        s3_client = boto3.client(
            "s3",
            aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
        )
        file_name = f"{username}-{uid}-{file_name}"

        # upload the file
        s3_client.put_object(
            Body=file_to_upload, Bucket=Config.AWS_STORAGE_BUCKET_NAME, Key=file_name
        )

        s3 = boto3.resource(
            "s3",
            aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
        )

        # set visibility of the uplaoded file as public
        object_acl = s3.ObjectAcl(Config.AWS_STORAGE_BUCKET_NAME, file_name)
        object_acl.put(ACL="public-read")

        s3_url = f"{Config.S3_BASE_URL}/{file_name}"

        return s3_url

    except Exception as e:
        new_line_print(f"exception = {e}")


def delete_from_s3(object_keys: list) -> bool:
    if (
        not isinstance(object_keys, list)
        and not isinstance(object_keys, tuple)
        and not isinstance(object_keys, set)
    ):
        raise TypeError("You must pass an iterable as the parameter")

    s3_client = boto3.resource("s3")

    for key in object_keys:
        obj_to_delete = s3_client.Object(Config.AWS_STORAGE_BUCKET_NAME, key)
        print(f"\nobj_to_delete = {obj_to_delete}\n")
        obj_to_delete.delete()
