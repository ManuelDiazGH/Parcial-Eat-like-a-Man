# Parcial Eat Like a Man

Aplicaci?n fullstack desarrollada para el primer parcial de Programaci?n 4.

## Stack
- **Backend:** FastAPI + SQLModel + PostgreSQL
- **Frontend:** React + TypeScript + TanStack Query + React Router

## Funcionalidad principal
- CRUD de categor?as, ingredientes y productos
- Relaci?n N:N entre productos, categor?as e ingredientes
- Relaci?n reflexiva de subcategor?as (`Categoria -> parent_id`)
- Borrado l?gico en categor?as, ingredientes y productos
- Navegaci?n con rutas din?micas para detalles

## Video
- YouTube: https://youtu.be/s7_tItsn4Do

## Repositorio
- GitHub: https://github.com/ManuelDiazGH/Parcial-Eat-like-a-Man

## C?mo ejecutar

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
