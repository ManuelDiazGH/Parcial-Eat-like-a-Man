import { Route, Routes } from 'react-router-dom'

import CategoriaDetallePage from '../pages/CategoriaDetallePage'
import CategoriasPage from '../pages/CategoriasPage'
import HomePage from '../pages/HomePage'
import IngredientesPage from '../pages/IngredientesPage'
import ProductoDetallePage from '../pages/ProductoDetallePage'
import ProductosPage from '../pages/ProductosPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categorias" element={<CategoriasPage />} />
      <Route path="/categorias/:id" element={<CategoriaDetallePage />} />
      <Route path="/ingredientes" element={<IngredientesPage />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/productos/:id" element={<ProductoDetallePage />} />
    </Routes>
  )
}
