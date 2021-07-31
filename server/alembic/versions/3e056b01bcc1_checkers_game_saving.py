"""checkers game saving

Revision ID: 3e056b01bcc1
Revises: f3bbc621ad45
Create Date: 2021-07-31 22:18:20.855913

"""
from datetime import datetime
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "3e056b01bcc1"
down_revision = "f3bbc621ad45"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "single_checkers_game",
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
    op.drop_table("single_checkers_game")
