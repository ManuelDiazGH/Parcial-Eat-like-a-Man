// Esta page se queda con la lógica.
// La parte visual de cada card vive en IngredienteCard.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import type { Ingrediente } from '../types'
import IngredienteCard from '../components/IngredienteCard'

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

export default function IngredientesPage() {
  const queryClient = useQueryClient()
  const [nombre, setNombre] = useState('')
  const [editando, setEditando] = useState<Ingrediente | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const { data: ingredientes = [], isLoading, isError } = useQuery<Ingrediente[]>({
    queryKey: ['ingredientes'],
    queryFn: () => api.get('/ingredientes/').then(r => r.data),
  })

  const crear = useMutation({
    mutationFn: (nombre: string) => api.post('/ingredientes/', { nombre }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); cerrarModal() },
  })

  const actualizar = useMutation({
    mutationFn: ({ id, nombre }: { id: number; nombre: string }) =>
      api.put(`/ingredientes/${id}`, { nombre }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); cerrarModal() },
  })

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/ingredientes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] }),
  })

  const abrirCrear = () => { setEditando(null); setNombre(''); setModalAbierto(true) }
  const abrirEditar = (ing: Ingrediente) => { setEditando(ing); setNombre(ing.nombre); setModalAbierto(true) }
  const cerrarModal = () => { setModalAbierto(false); setNombre(''); setEditando(null) }
  const handleSubmit = () => {
    if (!nombre.trim()) return
    editando ? actualizar.mutate({ id: editando.id, nombre }) : crear.mutate(nombre)
  }

  if (isLoading) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// CARGANDO...</p>
  if (isError) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// ERROR DE CONEXIÓN</p>

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: 0 }}>
            // {ingredientes.length.toString().padStart(2, '0')} INGREDIENTES REGISTRADOS
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1, margin: '0.5rem 0 0' }}>
            COMBUS<span style={{ color: '#cc1a1a' }}>TIBLE</span>
          </h1>
        </div>
        <button onClick={abrirCrear} style={btnRed}>+ NUEVO INGREDIENTE</button>
      </div>

      {/* Grid de cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', backgroundColor: '#1a1a1a' }}>
        {ingredientes.map((ing, idx) => (
          <IngredienteCard
            key={ing.id}
            ingrediente={ing}
            index={idx}
            onEditar={abrirEditar}
            onEliminar={(id) => eliminar.mutate(id)}
          />
        ))}
      </div>

      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', padding: '2.5rem', width: '460px' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 0.5rem' }}>
              // {editando ? 'MODIFICAR' : 'NUEVO'} INGREDIENTE
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', margin: '0 0 2rem' }}>
              {editando ? 'EDITAR' : 'AGREGAR'} <span style={{ color: '#cc1a1a' }}>INGREDIENTE</span>
            </h2>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>NOMBRE</label>
            <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: SAL PATAGÓNICA" />
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
