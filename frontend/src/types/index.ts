// Estos tipos tienen que ir a la par de lo que devuelve el backend.
// Si cambia un schema, esto también se ajusta.

export interface Categoria {
  id: number
  nombre: string
  imagen_url?: string | null
  parent_id?: number | null
}

export interface CategoriaConSubcategorias extends Categoria {
  subcategorias: Categoria[]
}

export interface Ingrediente {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  disponible: boolean
  imagen_url?: string | null
  categorias: Categoria[]
  ingredientes: Ingrediente[]
}
