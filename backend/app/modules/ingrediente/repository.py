# Patrón Repository: centraliza todas las operaciones con la base de datos
# El service nunca toca la DB directamente, siempre pasa por acá


from sqlmodel import Session, select
from app.modules.ingrediente.model import Ingrediente
from typing import List, Optional

class IngredienteRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Ingrediente]:
        return self.session.exec(select(Ingrediente)).all()

    def get_by_id(self, id: int) -> Optional[Ingrediente]:
        return self.session.get(Ingrediente, id)

    def add(self, ingrediente: Ingrediente) -> Ingrediente:
        self.session.add(ingrediente)
        self.session.flush()
        self.session.refresh(ingrediente)
        return ingrediente

    def delete(self, ingrediente: Ingrediente) -> None:
        self.session.delete(ingrediente)
        self.session.flush()