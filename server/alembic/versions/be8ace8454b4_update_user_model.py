"""update user model

Revision ID: be8ace8454b4
Revises: 419ee654ea7e
Create Date: 2021-07-18 18:34:15.912707

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "be8ace8454b4"
down_revision = "419ee654ea7e"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("username", sa.String, nullable=False),
        sa.Column("password", sa.String, nullable=False),
        sa.Column("salt", sa.String, nullable=False),
        sa.Column("firstName", sa.String, default=""),
        sa.Column("lastName", sa.String, default=""),
        sa.Column("email", sa.String, default=""),
    )


def downgrade():
    op.drop_table("user")
