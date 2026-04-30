# Parcial Eat Like a Man

Aplicacion fullstack desarrollada para el primer parcial de Programacion 4.

## Stack
- **Backend:** FastAPI + SQLModel + PostgreSQL
- **Frontend:** React + TypeScript + TanStack Query + React Router

## Funcionalidad principal
- CRUD de categorias, ingredientes y productos
- Relacion N:N entre productos, categorias e ingredientes
- Relacion reflexiva de subcategorias (`Categoria -> parent_id`)
- Borrado logico en categorias, ingredientes y productos
- Navegacion con rutas dinamicas para detalles

## Video
- YouTube: https://youtu.be/s7_tItsn4Do

## Repositorio
- GitHub: https://github.com/ManuelDiazGH/Parcial-Eat-like-a-Man

## Como ejecutar

### Backend
```bash
cd backend
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Nota
No se incluye `node_modules` en el repositorio.
