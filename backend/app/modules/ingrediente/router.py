from fastapi import APIRouter
from app.modules.ingrediente.schema import IngredienteCreate, IngredienteUpdate, IngredienteOut
from app.modules.ingrediente import service
from typing import List

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

@router.get("/", response_model=List[IngredienteOut])
def listar():
    return service.get_ingredientes()

@router.post("/", response_model=IngredienteOut, status_code=201)
def crear(data: IngredienteCreate):
    return service.create_ingrediente(data)

@router.put("/{ingrediente_id}", response_model=IngredienteOut)
def actualizar(ingrediente_id: int, data: IngredienteUpdate):
    return service.update_ingrediente(ingrediente_id, data)

@router.delete("/{ingrediente_id}")
def eliminar(ingrediente_id: int):
    return service.delete_ingrediente(ingrediente_id)