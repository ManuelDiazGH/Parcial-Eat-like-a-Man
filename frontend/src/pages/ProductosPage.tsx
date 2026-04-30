// Esta page coordina la lógica.
// Cada card se renderiza aparte para no inflar este archivo.

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import type { Producto, Categoria, Ingrediente } from '../types'
import ProductoCard from '../components/ProductoCard'

type Filtro = 'todos' | 'disponibles' | 'no_disponibles' | 'precio_asc' | 'precio_desc'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 1rem',
  backgroundColor: '#1a1a1a', border: '1px solid #333',
  color: '#ede8df', fontFamily: 'Oswald', fontSize: '1rem',
  outline: 'none', marginBottom: '1rem',
}

const btnRed: React.CSSProperties = {
  backgroundColor: '#cc1a1a', color: '#fff', padding: '0.75rem 2rem',
  fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em',
  border: 'none', cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  backgroundColor: 'transparent', color: '#ede8df', padding: '0.75rem 2rem',
  fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em',
  border: '1px solid #333', cursor: 'pointer',
}

export default function ProductosPage() {
  const queryClient = useQueryClient()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState(0)
  const [stock, setStock] = useState(0)
  const [disponible, setDisponible] = useState(true)
  const [categoriasIds, setCategoriasIds] = useState<number[]>([])
  const [ingredientesIds, setIngredientesIds] = useState<number[]>([])
  const [editando, setEditando] = useState<Producto | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [imagenUrl, setImagenUrl] = useState('')

  const { data: productos = [], isLoading, isError } = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos/').then(r => r.data),
  })

  const { data: categorias = [] } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias/').then(r => r.data),
  })

  const { data: ingredientes = [] } = useQuery<Ingrediente[]>({
    queryKey: ['ingredientes'],
    queryFn: () => api.get('/ingredientes/').then(r => r.data),
  })

  const productosFiltrados = useMemo(() => {
    let lista = [...productos]
    if (busqueda.trim()) lista = lista.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    if (filtro === 'disponibles') lista = lista.filter(p => p.disponible)
    else if (filtro === 'no_disponibles') lista = lista.filter(p => !p.disponible)
    else if (filtro === 'precio_asc') lista.sort((a, b) => a.precio - b.precio)
    else if (filtro === 'precio_desc') lista.sort((a, b) => b.precio - a.precio)
    return lista
  }, [productos, busqueda, filtro])

  const crear = useMutation({
    mutationFn: () => api.post('/productos/', { nombre, precio, stock, disponible, imagen_url: imagenUrl || null, categorias_ids: categoriasIds, ingredientes_ids: ingredientesIds }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); cerrarModal() },
  })

  const actualizar = useMutation({
    mutationFn: () => api.put(`/productos/${editando?.id}`, { nombre, precio, stock, disponible, imagen_url: imagenUrl || null, categorias_ids: categoriasIds, ingredientes_ids: ingredientesIds }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); cerrarModal() },
  })

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/productos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  })

  const toggleId = (id: number, lista: number[], setLista: (l: number[]) => void) =>
    setLista(lista.includes(id) ? lista.filter(x => x !== id) : [...lista, id])

  const abrirCrear = () => {
    setEditando(null); setNombre(''); setPrecio(0); setStock(0); setDisponible(true)
    setCategoriasIds([]); setIngredientesIds([]); setImagenUrl(''); setModalAbierto(true)
  }

  const abrirEditar = (p: Producto) => {
    setEditando(p); setNombre(p.nombre); setPrecio(p.precio); setStock(p.stock)
    setDisponible(p.disponible); setImagenUrl(p.imagen_url || '')
    setCategoriasIds(p.categorias.map(c => c.id))
    setIngredientesIds(p.ingredientes.map(i => i.id))
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false); setNombre(''); setPrecio(0); setStock(0); setDisponible(true)
    setCategoriasIds([]); setIngredientesIds([]); setImagenUrl(''); setEditando(null)
  }

  const handleSubmit = () => { if (!nombre.trim()) return; editando ? actualizar.mutate() : crear.mutate() }

  if (isLoading) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// CARGANDO...</p>
  if (isError) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// ERROR DE CONEXIÓN</p>

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: 0 }}>
            // {productosFiltrados.length.toString().padStart(2, '0')} PRODUCTOS · 0 EXCUSAS
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1, margin: '0.5rem 0 0' }}>
            EL <span style={{ color: '#cc1a1a' }}>ARSENAL</span>
          </h1>
        </div>
        <button onClick={abrirCrear} style={btnRed}>+ AGREGAR PRODUCTO</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="// BUSCAR PRODUCTO..."
          style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#ede8df', fontFamily: 'JetBrains Mono', fontSize: '0.85rem', outline: 'none' }} />
        <select value={filtro} onChange={e => setFiltro(e.target.value as Filtro)}
          style={{ padding: '0.75rem 1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#ede8df', fontFamily: 'Bebas Neue', fontSize: '1rem', letterSpacing: '0.1em', outline: 'none', cursor: 'pointer' }}>
          <option value="todos">TODOS</option>
          <option value="disponibles">DISPONIBLES</option>
          <option value="no_disponibles">NO DISPONIBLES</option>
          <option value="precio_asc">PRECIO: MENOR A MAYOR</option>
          <option value="precio_desc">PRECIO: MAYOR A MENOR</option>
        </select>
      </div>

      {/* Grid de cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1px', backgroundColor: '#1a1a1a' }}>
        {productosFiltrados.map((p, idx) => (
          <ProductoCard
            key={p.id}
            producto={p}
            index={idx}
            onEditar={abrirEditar}
            onEliminar={(id) => eliminar.mutate(id)}
          />
        ))}
      </div>

      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', padding: '2.5rem', width: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 0.5rem' }}>
              // {editando ? 'MODIFICAR' : 'NUEVO'} PRODUCTO
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', margin: '0 0 2rem' }}>
              {editando ? 'EDITAR' : 'AGREGAR AL'} <span style={{ color: '#cc1a1a' }}>ARSENAL</span>
            </h2>

            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>NOMBRE</label>
            <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: TOMAHAWK PREMIUM" />

            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>URL DE IMAGEN (opcional)</label>
            <input style={inputStyle} value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} placeholder="https://..." />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>PRECIO ($)</label>
                <input style={inputStyle} type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} min={0} />
              </div>
              <div>
                <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>STOCK</label>
                <input style={inputStyle} type="number" value={stock} onChange={e => setStock(Number(e.target.value))} min={0} />
              </div>
            </div>

            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em', display: 'block', marginBottom: '0.75rem' }}>DISPONIBILIDAD</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setDisponible(true)} style={{ ...btnGhost, flex: 1, padding: '0.5rem', fontSize: '0.9rem', backgroundColor: disponible ? '#1a3300' : 'transparent', color: disponible ? '#55cc00' : '#9a9a8a', border: `1px solid ${disponible ? '#55cc00' : '#333'}` }}>DISPONIBLE</button>
              <button onClick={() => setDisponible(false)} style={{ ...btnGhost, flex: 1, padding: '0.5rem', fontSize: '0.9rem', backgroundColor: !disponible ? '#1a0000' : 'transparent', color: !disponible ? '#cc1a1a' : '#9a9a8a', border: `1px solid ${!disponible ? '#cc1a1a' : '#333'}` }}>AGOTADO</button>
            </div>

            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>CATEGORÍAS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              {categorias.map(c => (
                <button key={c.id} onClick={() => toggleId(c.id, categoriasIds, setCategoriasIds)}
                  style={{ padding: '0.4rem 1rem', fontFamily: 'Bebas Neue', fontSize: '0.9rem', letterSpacing: '0.1em', cursor: 'pointer', backgroundColor: categoriasIds.includes(c.id) ? '#cc1a1a' : 'transparent', color: categoriasIds.includes(c.id) ? '#fff' : '#9a9a8a', border: `1px solid ${categoriasIds.includes(c.id) ? '#cc1a1a' : '#333'}` }}>
                  {c.nombre.toUpperCase()}
                </button>
              ))}
            </div>

            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>INGREDIENTES</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', marginTop: '0.5rem' }}>
              {ingredientes.map(i => (
                <button key={i.id} onClick={() => toggleId(i.id, ingredientesIds, setIngredientesIds)}
                  style={{ padding: '0.4rem 1rem', fontFamily: 'Bebas Neue', fontSize: '0.9rem', letterSpacing: '0.1em', cursor: 'pointer', backgroundColor: ingredientesIds.includes(i.id) ? '#b45a00' : 'transparent', color: ingredientesIds.includes(i.id) ? '#fff' : '#9a9a8a', border: `1px solid ${ingredientesIds.includes(i.id) ? '#b45a00' : '#333'}` }}>
                  {i.nombre.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={cerrarModal} style={btnGhost}>CANCELAR</button>
              <button onClick={handleSubmit} style={btnRed}>{editando ? 'GUARDAR' : 'AGREGAR'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
