# Modelo SQLModel: define la tabla en la DB
# Relationship + back_populates establece la relación bidireccional entre tablas
# link_model indica la tabla intermedia para la relación N:N

from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING
from app.modules.producto.link_models import ProductoIngrediente

if TYPE_CHECKING:
    from app.modules.producto.model import Producto

class Ingrediente(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str

    productos: List["Producto"] = Relationship(back_populates="ingredientes", link_model=ProductoIngrediente)

