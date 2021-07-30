"""chess table

Revision ID: 1722ea1b4725
Revises: 59690a9f5c8a
Create Date: 2021-07-30 12:32:35.602887

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql.expression import null


# revision identifiers, used by Alembic.
revision = "1722ea1b4725"
down_revision = "59690a9f5c8a"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "chess_games",
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
    op.drop_table("chess_games")
