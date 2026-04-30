from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.modules.producto.link_models import ProductoCategoria, ProductoIngrediente

if TYPE_CHECKING:
    from app.modules.categoria.model import Categoria
    from app.modules.ingrediente.model import Ingrediente


class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=1, max_length=150)
    precio: float = Field(default=0.0, ge=0)
    stock: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)
    imagen_url: str | None = Field(default=None)
    activo: bool = Field(default=True)

    categorias: list["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria,
    )
    ingredientes: list["Ingrediente"] = Relationship(
        back_populates="productos",
        link_model=ProductoIngrediente,
    )
