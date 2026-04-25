from sqlmodel import SQLModel

class IngredienteCreate(SQLModel):
    nombre: str

class IngredienteUpdate(SQLModel):
    nombre: str

class IngredienteOut(SQLModel):
    id: int
    nombre: str

