from fastapi import APIRouter

from app.modules.ingrediente import service
from app.modules.ingrediente.schema import IngredienteCreate, IngredienteOut, IngredienteUpdate

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.get("/", response_model=list[IngredienteOut])
def listar():
    return service.get_ingredientes()


@router.post("/", response_model=IngredienteOut, status_code=201)
def crear(data: IngredienteCreate):
    return service.create_ingrediente(data)


@router.put("/{ingrediente_id}", response_model=IngredienteOut)
def actualizar(ingrediente_id: int, data: IngredienteUpdate):
    return service.update_ingrediente(ingrediente_id, data)


@router.delete("/{ingrediente_id}", status_code=204)
def eliminar(ingrediente_id: int):
    service.delete_ingrediente(ingrediente_id)
