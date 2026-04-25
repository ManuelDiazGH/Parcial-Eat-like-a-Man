from sqlmodel import SQLModel

class CategoriaCreate(SQLModel):
    nombre: str
    imagen_url: str | None = None

class CategoriaUpdate(SQLModel):
    nombre: str
    imagen_url: str | None = None

class CategoriaOut(SQLModel):
    id: int
    nombre: str
    imagen_url: str | None = None