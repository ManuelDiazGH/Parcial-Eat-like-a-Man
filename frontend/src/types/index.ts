export interface Categoria {
  id: number
  nombre: string
  imagen_url?: string
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
  imagen_url?: string
  categorias: Categoria[]
  ingredientes: Ingrediente[]
}