from typing import Annotated

from fastapi import APIRouter, Query

from app.modules.categoria import service
from app.modules.categoria.schema import (
    CategoriaConSubcategoriasOut,
    CategoriaCreate,
    CategoriaOut,
    CategoriaUpdate,
)

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.get("/", response_model=list[CategoriaOut])
def listar(
    nombre: Annotated[str | None, Query(description="Filtrar por nombre")] = None,
):
    categorias = service.get_categorias()
    if nombre:
        termino = nombre.lower()
        categorias = [c for c in categorias if termino in c.nombre.lower()]
    return categorias


@router.get("/{categoria_id}", response_model=CategoriaConSubcategoriasOut)
def detalle(categoria_id: int):
    return service.get_categoria(categoria_id)


@router.get("/{categoria_id}/subcategorias", response_model=list[CategoriaOut])
def subcategorias(categoria_id: int):
    return service.get_subcategorias(categoria_id)


@router.post("/", response_model=CategoriaOut, status_code=201)
def crear(data: CategoriaCreate):
    return service.create_categoria(data)


@router.put("/{categoria_id}", response_model=CategoriaOut)
def actualizar(categoria_id: int, data: CategoriaUpdate):
    return service.update_categoria(categoria_id, data)


@router.delete("/{categoria_id}", status_code=204)
def eliminar(categoria_id: int):
    service.delete_categoria(categoria_id)
