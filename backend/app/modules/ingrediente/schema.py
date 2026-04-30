from pydantic import Field
from sqlmodel import SQLModel


class IngredienteCreate(SQLModel):
    nombre: str = Field(min_length=1, max_length=100)


class IngredienteUpdate(SQLModel):
    nombre: str = Field(min_length=1, max_length=100)


class IngredienteOut(SQLModel):
    id: int
    nombre: str
