from pydantic import Field
from sqlmodel import SQLModel


class CategoriaOut(SQLModel):
    id: int
    nombre: str


class IngredienteOut(SQLModel):
    id: int
    nombre: str


class ProductoCreate(SQLModel):
    nombre: str = Field(min_length=1, max_length=150)
    precio: float = Field(default=0.0, ge=0)
    stock: int = Field(default=0, ge=0)
    disponible: bool = True
    imagen_url: str | None = None
    categorias_ids: list[int] = Field(default_factory=list)
    ingredientes_ids: list[int] = Field(default_factory=list)


class ProductoOut(SQLModel):
    id: int
    nombre: str
    precio: float
    stock: int
    disponible: bool
    imagen_url: str | None = None
    categorias: list[CategoriaOut] = Field(default_factory=list)
    ingredientes: list[IngredienteOut] = Field(default_factory=list)
