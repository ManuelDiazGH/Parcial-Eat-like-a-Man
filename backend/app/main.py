# Punto de entrada de la aplicación FastAPI
# on_startup crea las tablas en PostgreSQL si no existen
# Cada router está separado por módulo (categorias, ingredientes, productos)

from fastapi import FastAPI
from app.core.database import create_db_and_tables
from app.modules.categoria.router import router as categoria_router
from app.modules.ingrediente.router import router as ingrediente_router
from app.modules.producto.router import router as producto_router

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(ingrediente_router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "La api anda!"}

