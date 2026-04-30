from fastapi import HTTPException

from app.core.uow import UnitOfWork
from app.modules.ingrediente.model import Ingrediente
from app.modules.ingrediente.repository import IngredienteRepository
from app.modules.ingrediente.schema import IngredienteCreate, IngredienteUpdate


def _serialize_ingrediente(ingrediente: Ingrediente) -> dict:
    return {"id": ingrediente.id, "nombre": ingrediente.nombre}


def _get_ingrediente_activo(repo: IngredienteRepository, ingrediente_id: int) -> Ingrediente:
    ingrediente = repo.get_by_id(ingrediente_id)
    if not ingrediente or not ingrediente.activo:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente


def get_ingredientes():
    with UnitOfWork() as uow:
        return IngredienteRepository(uow.session).get_all()


def create_ingrediente(data: IngredienteCreate):
    with UnitOfWork() as uow:
        repo = IngredienteRepository(uow.session)
        ingrediente = repo.add(Ingrediente(nombre=data.nombre))
        return _serialize_ingrediente(ingrediente)


def update_ingrediente(ingrediente_id: int, data: IngredienteUpdate):
    with UnitOfWork() as uow:
        repo = IngredienteRepository(uow.session)
        ingrediente = _get_ingrediente_activo(repo, ingrediente_id)
        ingrediente.nombre = data.nombre
        uow.session.add(ingrediente)
        uow.session.flush()
        return _serialize_ingrediente(ingrediente)


def delete_ingrediente(ingrediente_id: int):
    with UnitOfWork() as uow:
        repo = IngredienteRepository(uow.session)
        ingrediente = _get_ingrediente_activo(repo, ingrediente_id)
        ingrediente.activo = False
        uow.session.add(ingrediente)
        return {"ok": True}
