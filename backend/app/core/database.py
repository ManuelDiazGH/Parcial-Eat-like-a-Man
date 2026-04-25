# Conexión a PostgreSQL mediante SQLModel + SQLAlchemy
# create_db_and_tables() se llama al iniciar la app para crear las tablas automáticamente

from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

DATABASE_URL = "postgresql://postgres:admin12345@localhost:5432/parcial_db"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session