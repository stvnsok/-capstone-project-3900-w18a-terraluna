# capstone-project-3900-w18a-terraluna/backend

## Development: Installation & Setup

Flask reads key-value pairs from `.env` and sets them as environment variables.

Create a Postgres database and set `DATABASE_URL` to `dialect+driver://username:password@host:port/database`.

For example, `postgresql+psycopg2://james:james@localhost:5432/terraluna`.

```bash
# Create a virtual environment in `./venv/`
$ python -m venv venv

# Activate the virtual environment
$ source venv/bin/activate

# Install requirements
$ python -m pip install -r requirements.txt

# Sync database
$ flask db upgrade
```

### Migrations

`Flask-Migrate` handles `SQLAlchemy` database migrations using `alembic`. To add a migration, ensure the models are imported in the app, and run

```bash
$ flask db migrate -m "Revision message" # change this
```

This will add a new migration to `./migrations/versions/` which can be synced using `flask db upgrade`. Ensure these migrations are added to version control.

Note that Alembic may not detect changes to table names or column names.

### Formatting

Use `black` to format code and `isort` to sort Python imports.

If using Visual Studio Code, install extensions `ms-python.isort` and `ms-python.black-formatter`. The `./.vscode/settings.json` file is designed to automatically run `black` and `isort` on save.

### Running

```bash
$ flask run
```

Server will run on `http://localhost:5000` by default. Use `-p` to change port.
