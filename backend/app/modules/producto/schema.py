from sqlmodel import SQLModel
from typing import List

class CategoriaOut(SQLModel):
    id: int
    nombre: str

class IngredienteOut(SQLModel):
    id: int
    nombre: str

class ProductoCreate(SQLModel):
    nombre: str
    precio: float = 0.0
    stock: int = 0
    disponible: bool = True
    imagen_url: str | None = None
    categorias_ids: List[int] = []
    ingredientes_ids: List[int] = []

class ProductoOut(SQLModel):
    id: int
    nombre: str
    precio: float
    stock: int
    disponible: bool
    imagen_url: str | None = None
    categorias: List[CategoriaOut] = []
    ingredientes: List[IngredienteOut] = []