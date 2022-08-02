"""Recipe Ingredient

Revision ID: 08e64c4decf9
Revises: 5df1e767d177
Create Date: 2022-07-20 20:21:36.272244

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "08e64c4decf9"
down_revision = "5df1e767d177"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "ingredient",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "recipe",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("contributor", sa.Integer(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("expected_duration", sa.Integer(), nullable=True),
        sa.Column("meal_type", sa.ARRAY(sa.Text()), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("diet_type", sa.ARRAY(sa.Text()), nullable=True),
        sa.Column("instructions", sa.Text(), nullable=True),
        sa.Column("photo_url", sa.Text(), nullable=True),
        sa.Column("video_url", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(
            ["contributor"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "recipe_ingredient",
        sa.Column("recipe_id", sa.Integer(), nullable=False),
        sa.Column("ingredient_id", sa.Integer(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=True),
        sa.Column("unit", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(
            ["ingredient_id"],
            ["ingredient.id"],
        ),
        sa.ForeignKeyConstraint(
            ["recipe_id"],
            ["recipe.id"],
        ),
        sa.PrimaryKeyConstraint("recipe_id", "ingredient_id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("recipe_ingredient")
    op.drop_table("recipe")
    op.drop_table("ingredient")
    # ### end Alembic commands ###
