from pydantic import Field
from sqlmodel import SQLModel


class CategoriaCreate(SQLModel):
    nombre: str = Field(min_length=1, max_length=100)
    imagen_url: str | None = None
    parent_id: int | None = None


class CategoriaUpdate(SQLModel):
    nombre: str = Field(min_length=1, max_length=100)
    imagen_url: str | None = None
    parent_id: int | None = None


class CategoriaOut(SQLModel):
    id: int
    nombre: str
    imagen_url: str | None = None
    parent_id: int | None = None


class CategoriaConSubcategoriasOut(CategoriaOut):
    subcategorias: list[CategoriaOut] = Field(default_factory=list)
