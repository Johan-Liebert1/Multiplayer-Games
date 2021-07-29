"""chess and checkers models

Revision ID: faab1c4afddc
Revises: 6f63ea00d891
Create Date: 2021-07-28 23:20:27.494014

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "faab1c4afddc"
down_revision = "6f63ea00d891"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "checkers_games",
        sa.Column(
            "user_id", sa.Integer, sa.ForeignKey("user_details.id"), nullable=False
        ),
        sa.Column("games_started", sa.Integer, nullable=False, default=0),
        sa.Column("games_won", sa.Integer, nullable=False, default=0),
        sa.Column("games_lost", sa.Integer, nullable=False, default=0),
        sa.Column("games_drawn", sa.Integer, nullable=False, default=0),
    )

    op.create_table(
        "chess_games",
        sa.Column(
            "user_id", sa.Integer, sa.ForeignKey("user_details.id"), nullable=False
        ),
        sa.Column("games_started", sa.Integer, nullable=False, default=0),
        sa.Column("games_won", sa.Integer, nullable=False, default=0),
        sa.Column("games_lost", sa.Integer, nullable=False, default=0),
        sa.Column("games_drawn", sa.Integer, nullable=False, default=0),
    )


def downgrade():
    op.drop_table("checkers_games")
    op.drop_table("chess_games")
