"""checkers table

Revision ID: c323aca205e8
Revises: 1722ea1b4725
Create Date: 2021-07-30 12:35:06.977110

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c323aca205e8"
down_revision = "1722ea1b4725"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "checkers_games",
        sa.Column(
            "game_id", sa.Integer, primary_key=True, autoincrement=True, nullable=False
        ),
        sa.Column(
            "username",
            sa.Text,
            sa.ForeignKey("user_details.username"),
            nullable=False,
        ),
        sa.Column("games_started", sa.Integer, nullable=False, default=0),
        sa.Column("games_won", sa.Integer, nullable=False, default=0),
        sa.Column("games_lost", sa.Integer, nullable=False, default=0),
        sa.Column("games_drawn", sa.Integer, nullable=False, default=0),
    )


def downgrade():
    op.drop_table("checkers_games")
