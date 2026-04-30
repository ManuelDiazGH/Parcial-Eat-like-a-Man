# Estas son las tablas puente de las relaciones N:N.
# ProductoCategoria une productos con categorías.
# ProductoIngrediente une productos con ingredientes.

from sqlmodel import SQLModel, Field
from typing import Optional

class ProductoCategoria(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id", primary_key=True)

class ProductoIngrediente(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    ingrediente_id: Optional[int] = Field(default=None, foreign_key="ingrediente.id", primary_key=True)

    
