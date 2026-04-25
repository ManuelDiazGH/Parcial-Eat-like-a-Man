# Modelo SQLModel: define la tabla en la DB
# Relationship + back_populates establece la relación bidireccional entre tablas
# link_model indica la tabla intermedia para la relación N:N


from sqlmodel import SQLModel, Field, Relationship
from typing import List, TYPE_CHECKING
from app.modules.producto.link_models import ProductoCategoria, ProductoIngrediente

if TYPE_CHECKING:
    from app.modules.categoria.model import Categoria
    from app.modules.ingrediente.model import Ingrediente

class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    precio: float = Field(default=0.0)
    stock: int = Field(default=0)
    disponible: bool = Field(default=True)
    imagen_url: str | None = Field(default=None)
    categorias: List["Categoria"] = Relationship(back_populates="productos", link_model=ProductoCategoria)
    ingredientes: List["Ingrediente"] = Relationship(back_populates="productos", link_model=ProductoIngrediente)