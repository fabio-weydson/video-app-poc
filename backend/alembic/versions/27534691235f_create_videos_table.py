"""create videos table

Revision ID: 27534691235f
Revises: 
Create Date: 2024-09-29 12:37:55.190666

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '27534691235f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "videos",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String, index=True),
        sa.Column("description", sa.String, index=True),
        sa.Column("moment", sa.Integer),
        sa.Column("video_id", sa.String, index=True),
    )
    pass


def downgrade() -> None:
    op.drop_table("videos")
    pass
