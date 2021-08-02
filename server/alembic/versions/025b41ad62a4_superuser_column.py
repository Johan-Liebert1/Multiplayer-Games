"""superuser column

Revision ID: 025b41ad62a4
Revises: 3e056b01bcc1
Create Date: 2021-08-02 21:08:56.991103

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "025b41ad62a4"
down_revision = "3e056b01bcc1"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "user_details",
        sa.Column("isSuperAdmin", sa.Boolean, nullable=True, default=False),
    )


def downgrade():
    pass
