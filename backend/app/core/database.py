# Acá se arma la conexión a PostgreSQL con SQLModel + SQLAlchemy.
# Cuando levanta la app, crea lo que falta y mete las columnas mínimas
# si la base ya venía armada de antes.

from typing import Generator

from sqlalchemy import text
from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "postgresql://postgres:admin12345@localhost:5432/parcial_db"

engine = create_engine(DATABASE_URL, echo=True)


def _ensure_schema_updates() -> None:
    statements = [
        "ALTER TABLE categoria ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE",
        "ALTER TABLE categoria ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES categoria(id)",
        "ALTER TABLE ingrediente ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE",
        "ALTER TABLE producto ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE",
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
    _ensure_schema_updates()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
