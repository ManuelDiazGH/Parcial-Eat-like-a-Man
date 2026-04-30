from fastapi import HTTPException
from sqlmodel import delete

from app.core.uow import UnitOfWork
from app.modules.categoria.repository import CategoriaRepository
from app.modules.ingrediente.repository import IngredienteRepository
from app.modules.producto.link_models import ProductoCategoria, ProductoIngrediente
from app.modules.producto.model import Producto
from app.modules.producto.repository import ProductoRepository
from app.modules.producto.schema import ProductoCreate, ProductoOut


def _activo(entidad) -> bool:
    return bool(entidad and getattr(entidad, "activo", True))


def _to_out(producto: Producto) -> ProductoOut:
    categorias_activas = [categoria for categoria in producto.categorias if _activo(categoria)]
    ingredientes_activos = [ingrediente for ingrediente in producto.ingredientes if _activo(ingrediente)]
    return ProductoOut(
        id=producto.id,
        nombre=producto.nombre,
        precio=producto.precio,
        stock=producto.stock,
        disponible=producto.disponible,
        imagen_url=producto.imagen_url,
        categorias=categorias_activas,
        ingredientes=ingredientes_activos,
    )


def _get_producto_activo(repo: ProductoRepository, producto_id: int) -> Producto:
    producto = repo.get_by_id(producto_id)
    if not producto or not producto.activo:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


def get_productos():
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        return [_to_out(producto) for producto in repo.get_all()]


def get_producto(producto_id: int):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        return _to_out(_get_producto_activo(repo, producto_id))


def get_productos_filtrados(limit: int):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        return [_to_out(producto) for producto in repo.get_all_limited(limit)]


def create_producto(data: ProductoCreate):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        cat_repo = CategoriaRepository(uow.session)
        ing_repo = IngredienteRepository(uow.session)

        producto = repo.add(
            Producto(
                nombre=data.nombre,
                precio=data.precio,
                stock=data.stock,
                disponible=data.disponible,
                imagen_url=data.imagen_url,
            )
        )

        for categoria_id in data.categorias_ids:
            categoria = cat_repo.get_by_id(categoria_id)
            if not _activo(categoria):
                raise HTTPException(status_code=404, detail=f"Categoria {categoria_id} no encontrada")
            repo.add_categoria_link(producto.id, categoria_id)

        for ingrediente_id in data.ingredientes_ids:
            ingrediente = ing_repo.get_by_id(ingrediente_id)
            if not _activo(ingrediente):
                raise HTTPException(status_code=404, detail=f"Ingrediente {ingrediente_id} no encontrado")
            repo.add_ingrediente_link(producto.id, ingrediente_id)

        uow.session.flush()
        producto_final = _get_producto_activo(repo, producto.id)
        return _to_out(producto_final)


def update_producto(producto_id: int, data: ProductoCreate):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        cat_repo = CategoriaRepository(uow.session)
        ing_repo = IngredienteRepository(uow.session)

        producto = _get_producto_activo(repo, producto_id)
        producto.nombre = data.nombre
        producto.precio = data.precio
        producto.stock = data.stock
        producto.disponible = data.disponible
        producto.imagen_url = data.imagen_url
        uow.session.add(producto)

        uow.session.exec(
            delete(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
        )
        uow.session.exec(
            delete(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
        )

        for categoria_id in data.categorias_ids:
            categoria = cat_repo.get_by_id(categoria_id)
            if not _activo(categoria):
                raise HTTPException(status_code=404, detail=f"Categoria {categoria_id} no encontrada")
            repo.add_categoria_link(producto_id, categoria_id)

        for ingrediente_id in data.ingredientes_ids:
            ingrediente = ing_repo.get_by_id(ingrediente_id)
            if not _activo(ingrediente):
                raise HTTPException(status_code=404, detail=f"Ingrediente {ingrediente_id} no encontrado")
            repo.add_ingrediente_link(producto_id, ingrediente_id)

        uow.session.flush()
        producto_final = _get_producto_activo(repo, producto_id)
        return _to_out(producto_final)


def delete_producto(producto_id: int):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        producto = _get_producto_activo(repo, producto_id)
        producto.activo = False
        uow.session.add(producto)
        return {"ok": True}
