from fastapi import HTTPException

from app.core.uow import UnitOfWork
from app.modules.categoria.model import Categoria
from app.modules.categoria.repository import CategoriaRepository
from app.modules.categoria.schema import CategoriaCreate, CategoriaUpdate


def _serialize_categoria(categoria: Categoria) -> dict:
    return {
        "id": categoria.id,
        "nombre": categoria.nombre,
        "imagen_url": categoria.imagen_url,
        "parent_id": categoria.parent_id,
    }


def _get_categoria_activa(repo: CategoriaRepository, categoria_id: int) -> Categoria:
    categoria = repo.get_by_id(categoria_id)
    if not categoria or not categoria.activo:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria


def _validar_parent(repo: CategoriaRepository, parent_id: int | None, categoria_id_actual: int | None = None) -> None:
    if parent_id is None:
        return

    if categoria_id_actual is not None and parent_id == categoria_id_actual:
        raise HTTPException(status_code=400, detail="Una categoria no puede ser su propia padre")

    parent = repo.get_by_id(parent_id)
    if not parent or not parent.activo:
        raise HTTPException(status_code=404, detail="Categoria padre no encontrada")


def get_categorias():
    with UnitOfWork() as uow:
        return CategoriaRepository(uow.session).get_all()


def get_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = _get_categoria_activa(repo, categoria_id)
        subcategorias = repo.get_subcategorias(categoria_id)
        return {
            **_serialize_categoria(categoria),
            "subcategorias": [_serialize_categoria(subcategoria) for subcategoria in subcategorias],
        }


def get_subcategorias(categoria_id: int):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        _get_categoria_activa(repo, categoria_id)
        return repo.get_subcategorias(categoria_id)


def create_categoria(data: CategoriaCreate):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        _validar_parent(repo, data.parent_id)
        categoria = repo.add(
            Categoria(
                nombre=data.nombre,
                imagen_url=data.imagen_url,
                parent_id=data.parent_id,
            )
        )
        return _serialize_categoria(categoria)


def update_categoria(categoria_id: int, data: CategoriaUpdate):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = _get_categoria_activa(repo, categoria_id)
        _validar_parent(repo, data.parent_id, categoria_id)

        categoria.nombre = data.nombre
        categoria.imagen_url = data.imagen_url
        categoria.parent_id = data.parent_id
        uow.session.add(categoria)
        uow.session.flush()

        return _serialize_categoria(categoria)


def delete_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = _get_categoria_activa(repo, categoria_id)
        categoria.activo = False
        uow.session.add(categoria)
        return {"ok": True}
