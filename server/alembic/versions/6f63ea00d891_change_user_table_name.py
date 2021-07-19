"""change user table name

Revision ID: 6f63ea00d891
Revises: 707048da9738
Create Date: 2021-07-18 21:18:07.327467

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "6f63ea00d891"
down_revision = "707048da9738"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_details",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("username", sa.String(50), nullable=False),
        sa.Column("password", sa.LargeBinary, nullable=False),
        sa.Column("salt", sa.LargeBinary, nullable=False),
        sa.Column("firstName", sa.String(50), default=""),
        sa.Column("lastName", sa.String(50), default=""),
        sa.Column("email", sa.String(100), default=""),
        sa.Column("profilePictureUrl", sa.String(250), default=""),
        sa.Column("profileBannerUrl", sa.String(250), default=""),
    )


def downgrade():
    op.drop_table("user_details")