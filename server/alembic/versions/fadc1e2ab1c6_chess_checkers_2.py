"""chess_checkers_2

Revision ID: fadc1e2ab1c6
Revises: faab1c4afddc
Create Date: 2021-07-28 23:30:53.835859

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "fadc1e2ab1c6"
down_revision = "faab1c4afddc"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "checkers_games",
        sa.Column("game_id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column(
            "user_id",
            sa.Integer,
            sa.ForeignKey("user_details.id"),
            nullable=False,
        ),
        sa.Column("games_started", sa.Integer, nullable=False, default=0),
        sa.Column("games_won", sa.Integer, nullable=False, default=0),
        sa.Column("games_lost", sa.Integer, nullable=False, default=0),
        sa.Column("games_drawn", sa.Integer, nullable=False, default=0),
    )

    op.create_table(
        "chess_games",
        sa.Column("game_id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column(
            "user_id",
            sa.Integer,
            sa.ForeignKey("user_details.id"),
            nullable=False,
        ),
        sa.Column("games_started", sa.Integer, nullable=False, default=0),
        sa.Column("games_won", sa.Integer, nullable=False, default=0),
        sa.Column("games_lost", sa.Integer, nullable=False, default=0),
        sa.Column("games_drawn", sa.Integer, nullable=False, default=0),
    )


def downgrade():
    op.drop_table("checkers_games")
    op.drop_table("chess_games")
