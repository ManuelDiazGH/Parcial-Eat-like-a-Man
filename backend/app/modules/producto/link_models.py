# Tablas intermedias para las relaciones N:N
# ProductoCategoria: un producto puede tener muchas categorías y viceversa
# ProductoIngrediente: un producto puede tener muchos ingredientes y viceversa

from sqlmodel import SQLModel, Field
from typing import Optional

class ProductoCategoria(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id", primary_key=True)

class ProductoIngrediente(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    ingrediente_id: Optional[int] = Field(default=None, foreign_key="ingrediente.id", primary_key=True)

    