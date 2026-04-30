from typing import Optional

from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.modules.producto.link_models import ProductoCategoria, ProductoIngrediente
from app.modules.producto.model import Producto


class ProductoRepository:
    def __init__(self, session: Session):
        self.session = session

    def _base_query(self):
        return select(Producto).options(
            selectinload(Producto.categorias),
            selectinload(Producto.ingredientes),
        )

    def get_all(self) -> list[Producto]:
        return self.session.exec(
            self._base_query().where(Producto.activo == True)
        ).all()

    def get_all_limited(self, limit: int) -> list[Producto]:
        return self.session.exec(
            self._base_query().where(Producto.activo == True).limit(limit)
        ).all()

    def get_by_id(self, producto_id: int) -> Optional[Producto]:
        return self.session.exec(
            self._base_query().where(Producto.id == producto_id)
        ).first()

    def add(self, producto: Producto) -> Producto:
        self.session.add(producto)
        self.session.flush()
        self.session.refresh(producto)
        return producto

    def add_categoria_link(self, producto_id: int, categoria_id: int) -> None:
        self.session.add(ProductoCategoria(producto_id=producto_id, categoria_id=categoria_id))

    def add_ingrediente_link(self, producto_id: int, ingrediente_id: int) -> None:
        self.session.add(ProductoIngrediente(producto_id=producto_id, ingrediente_id=ingrediente_id))
