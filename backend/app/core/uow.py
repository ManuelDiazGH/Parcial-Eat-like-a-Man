# Esta UoW se encarga de la sesión y de cerrar la transacción completa.
# Los services no hacen commit a mano.
# Si no explota nada, acá se confirma solo.

from sqlmodel import Session

from app.core.database import engine


class UnitOfWork:
    def __init__(self):
        # Esto evita que SQLAlchemy "olvide" los datos después del commit.
        # Si no, FastAPI intenta serializar objetos detached y termina en 500.
        self.session = Session(engine, expire_on_commit=False)

    def __enter__(self) -> "UnitOfWork":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type:
                self.rollback()
            else:
                self.commit()
        finally:
            self.session.close()

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()
