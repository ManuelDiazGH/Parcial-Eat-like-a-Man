from typing import Optional

from sqlmodel import Session, select

from app.modules.categoria.model import Categoria


class CategoriaRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> list[Categoria]:
        return self.session.exec(
            select(Categoria).where(Categoria.activo == True)
        ).all()

    def get_by_id(self, categoria_id: int) -> Optional[Categoria]:
        return self.session.get(Categoria, categoria_id)

    def get_subcategorias(self, parent_id: int) -> list[Categoria]:
        return self.session.exec(
            select(Categoria).where(
                Categoria.parent_id == parent_id,
                Categoria.activo == True,
            )
        ).all()

    def add(self, categoria: Categoria) -> Categoria:
        self.session.add(categoria)
        self.session.flush()
        self.session.refresh(categoria)
        return categoria
