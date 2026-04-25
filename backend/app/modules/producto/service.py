# Capa de lógica de negocio
# Usa UnitOfWork para manejar la transacción y Repository para acceder a la DB
# HTTPException lanza errores con códigos de estado HTTP (404, etc.)

from fastapi import HTTPException
from app.core.uow import UnitOfWork
from app.modules.producto.model import Producto
from app.modules.producto.repository import ProductoRepository
from app.modules.categoria.repository import CategoriaRepository
from app.modules.ingrediente.repository import IngredienteRepository
from app.modules.producto.schema import ProductoCreate, ProductoOut


def _to_out(p) -> ProductoOut:
    return ProductoOut(
        id=p.id, nombre=p.nombre,
        precio=p.precio, stock=p.stock, disponible=p.disponible,
        imagen_url=p.imagen_url,
        categorias=p.categorias, ingredientes=p.ingredientes
    )


def get_productos():
    with UnitOfWork() as uow:
        return [_to_out(p) for p in ProductoRepository(uow.session).get_all()]


def get_producto(producto_id: int):
    with UnitOfWork() as uow:
        productos = ProductoRepository(uow.session).get_all()
        producto = next((p for p in productos if p.id == producto_id), None)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return _to_out(producto)


def get_productos_filtrados(limit: int):
    with UnitOfWork() as uow:
        return [_to_out(p) for p in ProductoRepository(uow.session).get_all_limited(limit)]


def create_producto(data: ProductoCreate):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        cat_repo = CategoriaRepository(uow.session)
        ing_repo = IngredienteRepository(uow.session)

        producto = repo.add(Producto(
        nombre=data.nombre, precio=data.precio,
        stock=data.stock, disponible=data.disponible,
        imagen_url=data.imagen_url
        ))

        for cat_id in data.categorias_ids:
            if not cat_repo.get_by_id(cat_id):
                raise HTTPException(status_code=404, detail=f"Categoria {cat_id} no encontrada")
            repo.add_categoria_link(producto.id, cat_id)

        for ing_id in data.ingredientes_ids:
            if not ing_repo.get_by_id(ing_id):
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            repo.add_ingrediente_link(producto.id, ing_id)

        uow.commit()
        producto_final = next(p for p in repo.get_all_limited(1000) if p.id == producto.id)
        return _to_out(producto_final)


def update_producto(producto_id: int, data: ProductoCreate):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        cat_repo = CategoriaRepository(uow.session)
        ing_repo = IngredienteRepository(uow.session)

        producto = repo.get_by_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        producto.nombre = data.nombre
        producto.precio = data.precio
        producto.stock = data.stock
        producto.disponible = data.disponible
        uow.session.add(producto)
        producto.imagen_url = data.imagen_url

        from app.modules.producto.link_models import ProductoCategoria, ProductoIngrediente
        from sqlmodel import delete
        uow.session.exec(delete(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id))
        uow.session.exec(delete(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id))

        for cat_id in data.categorias_ids:
            if not cat_repo.get_by_id(cat_id):
                raise HTTPException(status_code=404, detail=f"Categoria {cat_id} no encontrada")
            repo.add_categoria_link(producto_id, cat_id)

        for ing_id in data.ingredientes_ids:
            if not ing_repo.get_by_id(ing_id):
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            repo.add_ingrediente_link(producto_id, ing_id)

        uow.commit()
        producto_final = next(p for p in repo.get_all_limited(1000) if p.id == producto_id)
        return _to_out(producto_final)


def delete_producto(producto_id: int):
    with UnitOfWork() as uow:
        repo = ProductoRepository(uow.session)
        producto = repo.get_by_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        repo.delete(producto)
        uow.commit()
        return {"ok": True}