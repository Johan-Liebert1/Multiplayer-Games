"""initial

Revision ID: 59690a9f5c8a
Revises: 
Create Date: 2021-07-30 12:30:18.374513

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "59690a9f5c8a"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_details",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("username", sa.String(50), nullable=False, unique=True),
        sa.Column("password", sa.LargeBinary, nullable=False),
        sa.Column("salt", sa.LargeBinary, nullable=False),
        sa.Column("firstName", sa.String(50), default=""),
        sa.Column("lastName", sa.String(50), default=""),
        sa.Column("email", sa.String(100), default=""),
        sa.Column("profilePictureUrl", sa.String(250), default=""),
    )


def downgrade():
    op.drop_table("user_details")
