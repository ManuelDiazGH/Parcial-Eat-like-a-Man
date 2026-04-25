from fastapi import APIRouter
from app.modules.categoria.schema import CategoriaCreate, CategoriaUpdate, CategoriaOut
from app.modules.categoria import service
from typing import List

router = APIRouter(prefix="/categorias", tags=["Categorias"])

@router.get("/", response_model=List[CategoriaOut])
def listar():
    return service.get_categorias()

@router.get("/{categoria_id}", response_model=CategoriaOut)
def detalle(categoria_id: int):
    return service.get_categoria(categoria_id)

@router.post("/", response_model=CategoriaOut, status_code=201)
def crear(data: CategoriaCreate):
    return service.create_categoria(data)

@router.put("/{categoria_id}", response_model=CategoriaOut)
def actualizar(categoria_id: int, data: CategoriaUpdate):
    return service.update_categoria(categoria_id, data)

@router.delete("/{categoria_id}")
def eliminar(categoria_id: int):
    return service.delete_categoria(categoria_id)
