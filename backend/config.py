import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False


# Create ProductionConfig, StagingConfig, DevelopmentConfig, TestingConfig, ... as needed
