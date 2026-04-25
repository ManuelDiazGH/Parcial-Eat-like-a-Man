# Patrón Unit of Work: encapsula la sesión y maneja la transacción completa
# Se usa con "with UnitOfWork() as uow:" — hace rollback automático si hay error

from sqlmodel import Session
from app.core.database import engine

class UnitOfWork:
    def __init__(self):
       self.session = Session(engine)

    def __enter__(self) -> "UnitOfWork":
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.rollback()
        self.session.close()

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()
