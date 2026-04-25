# Capa de lógica de negocio
# Usa UnitOfWork para manejar la transacción y Repository para acceder a la DB
# HTTPException lanza errores con códigos de estado HTTP (404, etc.)


from fastapi import HTTPException
from app.core.uow import UnitOfWork
from app.modules.ingrediente.model import Ingrediente
from app.modules.ingrediente.repository import IngredienteRepository
from app.modules.ingrediente.schema import IngredienteCreate, IngredienteUpdate

def get_ingredientes():
    with UnitOfWork() as uow:
        return IngredienteRepository(uow.session).get_all()

def create_ingrediente(data: IngredienteCreate):
    with UnitOfWork() as uow:
        repo = IngredienteRepository(uow.session)
        ingrediente = repo.add(Ingrediente(nombre=data.nombre))
        uow.commit()
        return {"id": ingrediente.id, "nombre": ingrediente.nombre}

def update_ingrediente(ingrediente_id: int, data: IngredienteUpdate):
    with UnitOfWork() as uow:
        repo = IngredienteRepository(uow.session)
        ingrediente = repo.get_by_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        ingrediente.nombre = data.nombre
        uow.session.add(ingrediente)
        uow.commit()
        uow.session.refresh(ingrediente)
        return ingrediente

def delete_ingrediente(ingrediente_id: int):
    with UnitOfWork() as uow:
        repo = IngredienteRepository(uow.session)
        ingrediente = repo.get_by_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        repo.delete(ingrediente)
        uow.commit()
        return {"ok": True}