from typing import Optional

from sqlmodel import Session, select

from app.modules.ingrediente.model import Ingrediente


class IngredienteRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> list[Ingrediente]:
        return self.session.exec(
            select(Ingrediente).where(Ingrediente.activo == True)
        ).all()

    def get_by_id(self, ingrediente_id: int) -> Optional[Ingrediente]:
        return self.session.get(Ingrediente, ingrediente_id)

    def add(self, ingrediente: Ingrediente) -> Ingrediente:
        self.session.add(ingrediente)
        self.session.flush()
        self.session.refresh(ingrediente)
        return ingrediente
