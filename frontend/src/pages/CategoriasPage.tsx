// Esta page solo maneja la lógicaa.
// Las cards y el modal viven aparte para que no quede un bloque enorme.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import type { Categoria } from '../types'
import CategoriaCard from '../components/CategoriaCard'
import CategoriaModal from '../components/CategoriaModal'

const btnRed: React.CSSProperties = {
  backgroundColor: '#cc1a1a', color: '#fff', padding: '0.75rem 2rem',
  fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em',
  border: 'none', cursor: 'pointer',
}

export default function CategoriasPage() {
  const queryClient = useQueryClient()

  // Estado del form y del modal
  const [nombre, setNombre] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [parentId, setParentId] = useState<number | null>(null)
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  // Estado que viene del backend
  const { data: categorias = [], isLoading, isError } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias/').then(r => r.data),
  })

  const crear = useMutation({
    mutationFn: (data: { nombre: string; imagen_url: string | null; parent_id: number | null }) =>
      api.post('/categorias/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      cerrarModal()
    },
  })

  const actualizar = useMutation({
    mutationFn: ({ id, ...data }: { id: number; nombre: string; imagen_url: string | null; parent_id: number | null }) =>
      api.put(`/categorias/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      cerrarModal()
    },
  })

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/categorias/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  })

  // Funciones del modal
  const abrirCrear = () => {
    setEditando(null); setNombre(''); setImagenUrl(''); setParentId(null)
    setModalAbierto(true)
  }

  const abrirEditar = (cat: Categoria) => {
    setEditando(cat); setNombre(cat.nombre)
    setImagenUrl(cat.imagen_url || ''); setParentId(cat.parent_id ?? null)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false); setNombre(''); setImagenUrl('')
    setParentId(null); setEditando(null)
  }

  const handleSubmit = () => {
    if (!nombre.trim()) return
    const payload = { nombre, imagen_url: imagenUrl || null, parent_id: parentId }
    editando
      ? actualizar.mutate({ id: editando.id, ...payload })
      : crear.mutate(payload)
  }

  if (isLoading) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// CARGANDO...</p>
  if (isError) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// ERROR DE CONEXIÓN</p>

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '4rem' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: 0 }}>
            // {categorias.length.toString().padStart(2, '0')} CATEGORÍAS REGISTRADAS
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1, margin: '0.5rem 0 0' }}>
            CLASIFI<span style={{ color: '#cc1a1a' }}>CACIONES</span>
          </h1>
        </div>
        <button onClick={abrirCrear} style={btnRed}>+ NUEVA CATEGORÍA</button>
      </div>

      {/* Grid de caards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', backgroundColor: '#1a1a1a' }}>
        {categorias.map((cat, idx) => (
          <CategoriaCard
            key={cat.id}
            categoria={cat}
            index={idx}
            onEditar={abrirEditar}
            onEliminar={(id) => eliminar.mutate(id)}
          />
        ))}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <CategoriaModal
          editando={editando}
          categorias={categorias}
          nombre={nombre}
          setNombre={setNombre}
          imagenUrl={imagenUrl}
          setImagenUrl={setImagenUrl}
          parentId={parentId}
          setParentId={setParentId}
          onConfirmar={handleSubmit}
          onCancelar={cerrarModal}
        />
      )}
    </div>
  )
}
