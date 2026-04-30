from typing import Annotated

from fastapi import APIRouter, Path, Query

from app.modules.producto import service
from app.modules.producto.schema import ProductoCreate, ProductoOut

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoOut])
def listar():
    return service.get_productos()


@router.get("/filtrar", response_model=list[ProductoOut])
def listar_filtrados(limit: Annotated[int, Query(gt=0, le=10)] = 5):
    return service.get_productos_filtrados(limit)


@router.get("/{producto_id}", response_model=ProductoOut)
def detalle(producto_id: Annotated[int, Path(gt=0)]):
    return service.get_producto(producto_id)


@router.put("/{producto_id}", response_model=ProductoOut)
def actualizar(producto_id: int, data: ProductoCreate):
    return service.update_producto(producto_id, data)


@router.post("/", response_model=ProductoOut, status_code=201)
def crear(data: ProductoCreate):
    return service.create_producto(data)


@router.delete("/{producto_id}", status_code=204)
def eliminar(producto_id: int):
    service.delete_producto(producto_id)
