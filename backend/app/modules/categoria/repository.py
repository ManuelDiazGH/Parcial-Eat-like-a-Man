# Patrón Repository: centraliza todas las operaciones con la base de datos
# El service nunca toca la DB directamente, siempre pasa por acá


from sqlmodel import Session, select
from app.modules.categoria.model import Categoria
from typing import List, Optional

class CategoriaRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Categoria]:
        return self.session.exec(select(Categoria)).all()
    
    def get_by_id(self, id: int) -> Optional[Categoria]:
        return self.session.get(Categoria, id)
    
    def add(self, categoria: Categoria) -> Categoria:
        self.session.add(categoria)
        self.session.flush()
        self.session.refresh(categoria)
        return categoria
    
    def delete(self, categoria: Categoria) -> None:
        self.session.delete(categoria)
        self.session.flush()