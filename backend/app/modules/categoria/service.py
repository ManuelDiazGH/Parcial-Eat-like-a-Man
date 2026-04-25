# Capa de lógica de negocio
# Usa UnitOfWork para manejar la transacción y Repository para acceder a la DB
# HTTPException lanza errores con códigos de estado HTTP (404, etc.)

from fastapi import HTTPException
from app.core.uow import UnitOfWork
from app.modules.categoria.model import Categoria
from app.modules.categoria.repository import CategoriaRepository
from app.modules.categoria.schema import CategoriaCreate, CategoriaUpdate

def get_categorias():
    with UnitOfWork() as uow:
        return CategoriaRepository(uow.session).get_all()
    
def get_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.get_by_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        return {"id": categoria.id, "nombre": categoria.nombre, "imagen_url": categoria.imagen_url}
    
def create_categoria(data: CategoriaCreate):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.add(Categoria(nombre=data.nombre, imagen_url=data.imagen_url))
        uow.commit()
        return {"id": categoria.id, "nombre": categoria.nombre, "imagen_url": categoria.imagen_url}

def update_categoria(categoria_id: int, data: CategoriaUpdate):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.get_by_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        categoria.nombre = data.nombre
        categoria.imagen_url = data.imagen_url
        uow.session.add(categoria)
        uow.commit()
        uow.session.refresh(categoria)
        return {"id": categoria.id, "nombre": categoria.nombre, "imagen_url": categoria.imagen_url}
    
def delete_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.get_by_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="No se encontro la categoria/NOT FOUND")
        repo.delete(categoria)
        uow.commit()
        return {"ok": True}
    
                             