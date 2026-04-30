from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.modules.producto.link_models import ProductoCategoria

if TYPE_CHECKING:
    from app.modules.producto.model import Producto


class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=1, max_length=100)
    imagen_url: str | None = Field(default=None)
    activo: bool = Field(default=True)
    parent_id: int | None = Field(default=None, foreign_key="categoria.id")

    parent: Optional["Categoria"] = Relationship(
        back_populates="subcategorias",
        sa_relationship_kwargs={"remote_side": "Categoria.id"},
    )
    subcategorias: list["Categoria"] = Relationship(back_populates="parent")
    productos: list["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoria,
    )
