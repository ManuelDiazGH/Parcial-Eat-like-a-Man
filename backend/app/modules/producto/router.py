# Endpoints del módulo Producto
# Annotated + Query en /filtrar: permite paginación con validación (gt=0, le=10)
# response_model evita filtrar datos sensibles o innecesarios en la respuesta

from fastapi import APIRouter, Query, Path
from typing import Annotated, List
from app.modules.producto.schema import ProductoCreate, ProductoOut
from app.modules.producto import service
from typing import Annotated

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=List[ProductoOut])
def listar():
    return service.get_productos()

@router.get("/{producto_id}", response_model=ProductoOut)
def detalle(producto_id: Annotated[int, Path(gt=0)]):
    return service.get_producto(producto_id)

@router.get("/filtrar", response_model=List[ProductoOut])
def listar_filtrados(limit: Annotated[int, Query(gt=0, le=10)] = 5):
    return service.get_productos_filtrados(limit)

@router.put("/{producto_id}")
def actualizar(producto_id: int, data: ProductoCreate):
    return service.update_producto(producto_id, data)

@router.post("/", response_model=ProductoOut, status_code=201)
def crear(data: ProductoCreate):
    return service.create_producto(data)

@router.delete("/{producto_id}")
def eliminar(producto_id: int):
    return service.delete_producto(producto_id)