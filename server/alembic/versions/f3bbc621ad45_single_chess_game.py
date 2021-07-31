"""single chess game

Revision ID: f3bbc621ad45
Revises: c323aca205e8
Create Date: 2021-07-31 13:04:48.405543

"""
from datetime import datetime
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f3bbc621ad45"
down_revision = "c323aca205e8"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "single_chess_game",
        sa.Column("game_id", sa.Integer, autoincrement=True, primary_key=True),
        sa.Column(
            "player1",
            sa.String(50),
            sa.ForeignKey("user_details.username"),
            nullable=False,
        ),
        sa.Column(
            "player2",
            sa.String(50),
            sa.ForeignKey("user_details.username"),
            nullable=False,
        ),
        sa.Column("moves", sa.Text, nullable=False),
        sa.Column("date", sa.DateTime, nullable=False, default=datetime.utcnow),
    )


def downgrade():
    op.drop_table("single_chess_game")
