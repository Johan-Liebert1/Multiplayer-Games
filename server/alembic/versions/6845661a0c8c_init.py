"""init

Revision ID: 6845661a0c8c
Revises: be8ace8454b4
Create Date: 2021-07-18 20:23:57.837444

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "6845661a0c8c"
down_revision = "be8ace8454b4"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_details",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("username", sa.String, nullable=False),
        sa.Column("password", sa.String, nullable=False),
        sa.Column("salt", sa.String, nullable=False),
        sa.Column("firstName", sa.String, default=""),
        sa.Column("lastName", sa.String, default=""),
        sa.Column("email", sa.String, default=""),
    )


def downgrade():
    op.drop_table("user_details")
