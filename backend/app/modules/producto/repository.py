#apuntess
# Patrón Repository: centraliza todas las operaciones con la base de datos
# El service nunca toca la DB directamente, siempre pasa por acaa

from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.modules.producto.model import Producto
from app.modules.producto.link_models import ProductoCategoria, ProductoIngrediente
from typing import List, Optional

class ProductoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Producto]:
        return self.session.exec(
            select(Producto).options(selectinload(Producto.categorias), selectinload(Producto.ingredientes))
        ).all()
    
    def get_all_limited(self, limit: int) -> List[Producto]:
        return self.session.exec(
            select(Producto).options(selectinload(Producto.categorias), selectinload(Producto.ingredientes)).limit(limit)
        ).all()
    
    def get_by_id(self, id: int) -> Optional[Producto]:
        return self.session.get(Producto, id)
    
    def add(self, producto: Producto) -> Producto:
        self.session.add(producto)
        self.session.flush()
        self.session.refresh(producto)
        return producto
    
    def delete(self, producto: Producto) -> None:
        self.session.delete(producto)
        self.session.flush()

    def add_categoria_link(self, producto_id: int, categoria_id: int) -> None:
        self.session.add(ProductoCategoria(producto_id=producto_id, categoria_id=categoria_id))

    def add_ingrediente_link(self, producto_id: int, ingrediente_id: int) -> None:
        self.session.add(ProductoIngrediente(producto_id=producto_id, ingrediente_id=ingrediente_id))

