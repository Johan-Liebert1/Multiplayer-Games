"""init

Revision ID: 419ee654ea7e
Revises: 
Create Date: 2021-07-18 12:39:06.512634

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "419ee654ea7e"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String),
    )


# incase we need to reverse the migration
def downgrade():
    op.drop_table("user")
