from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.modules.producto.link_models import ProductoIngrediente

if TYPE_CHECKING:
    from app.modules.producto.model import Producto


class Ingrediente(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=1, max_length=100)
    activo: bool = Field(default=True)
    productos: list["Producto"] = Relationship(
        back_populates="ingredientes",
        link_model=ProductoIngrediente,
    )
