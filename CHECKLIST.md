# Checklist del Proyecto Integrador

## Backend (FastAPI + SQLModel)
- [x] Entorno: proyecto separado en backend/frontend y `requirements.txt` incluido.
- [x] Modelado: tablas con SQLModel y relaciones `Relationship` (N:N y reflexiva 1:N en categor?as).
- [x] Validaci?n: uso de `Annotated`, `Query` y `Path`.
- [x] CRUD Persistente: endpoints funcionales contra PostgreSQL.
- [x] Seguridad de Datos: uso de `response_model`.
- [x] Estructura: c?digo organizado por m?dulos (`router`, `schema`, `service`, `model`, `repository`, `uow`).

## Frontend (React + TypeScript + Tailwind)
- [x] Setup: proyecto creado con Vite + TypeScript.
- [x] Componentes: componentes funcionales con props tipadas por interfaces.
- [ ] Estilos: interfaz construida ?ntegramente con clases de utilidad Tailwind CSS 4.
- [x] Navegaci?n: `react-router-dom` con rutas din?micas.
- [x] Estado Local: uso de `useState` para formularios y UI.

## Integraci?n y Server State
- [x] Lectura (`useQuery`): listados y detalles consumen la API.
- [x] Escritura (`useMutation`): formularios env?an datos al backend.
- [x] Sincronizaci?n: uso de `invalidateQueries`.
- [x] Feedback: estados de carga y error visibles.

## Observaciones de revisi?n docente
- [x] Relaci?n reflexiva de subcategor?as en backend.
- [x] Commit gestionado desde la Unit of Work.
- [x] Borrado l?gico aplicado.
- [x] AppRouter contiene las rutas.
- [x] Componentizaci?n de Navbar/HomePage y cards principales.

## Pendientes honestos
- [ ] Migrar el styling a Tailwind utilitario puro si se quiere cumplir literalmente ese punto del PDF.
- [ ] Reemplazar cards por tablas si el docente exige estrictamente el formato textual del enunciado.
