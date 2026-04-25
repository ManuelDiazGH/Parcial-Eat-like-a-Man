import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import type { Categoria } from '../types'

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  backgroundColor: '#1a1a1a', border: '1px solid #333',
  color: '#ede8df', fontFamily: 'Oswald', fontSize: '1rem',
  outline: 'none', marginBottom: '1rem',
}

const btnRed = {
  backgroundColor: '#cc1a1a', color: '#fff', padding: '0.75rem 2rem',
  fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em',
  border: 'none', cursor: 'pointer',
}

const btnGhost = {
  backgroundColor: 'transparent', color: '#ede8df', padding: '0.75rem 2rem',
  fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em',
  border: '1px solid #333', cursor: 'pointer',
}

export default function CategoriasPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const { data: categorias = [], isLoading, isError } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias/').then(r => r.data),
  })

  const crear = useMutation({
    mutationFn: (data: { nombre: string; imagen_url: string | null }) =>
      api.post('/categorias/', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); cerrarModal() },
  })

  const actualizar = useMutation({
    mutationFn: ({ id, ...data }: { id: number; nombre: string; imagen_url: string | null }) =>
      api.put(`/categorias/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); cerrarModal() },
  })

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/categorias/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  })

  const abrirCrear = () => { setEditando(null); setNombre(''); setImagenUrl(''); setModalAbierto(true) }
  const abrirEditar = (cat: Categoria) => { setEditando(cat); setNombre(cat.nombre); setImagenUrl(cat.imagen_url || ''); setModalAbierto(true) }
  const cerrarModal = () => { setModalAbierto(false); setNombre(''); setImagenUrl(''); setEditando(null) }

  const handleSubmit = () => {
    if (!nombre.trim()) return
    editando
      ? actualizar.mutate({ id: editando.id, nombre, imagen_url: imagenUrl || null })
      : crear.mutate({ nombre, imagen_url: imagenUrl || null })
  }

  if (isLoading) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// CARGANDO...</p>
  if (isError) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// ERROR DE CONEXIÓN</p>

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: 0 }}>
            // {categorias.length.toString().padStart(2, '0')} CATEGORÍAS REGISTRADAS
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1, margin: '0.5rem 0 0' }}>
            CLASIFI<span style={{ color: '#cc1a1a' }}>CACIONES</span>
          </h1>
        </div>
        <button onClick={abrirCrear} style={btnRed}>+ NUEVA CATEGROÍA</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', backgroundColor: '#1a1a1a' }}>
        {categorias.map((cat, idx) => (
          <div key={cat.id} style={{ backgroundColor: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
            {cat.imagen_url && (
              <div style={{ height: '160px', overflow: 'hidden' }}>
                <img src={cat.imagen_url} alt={cat.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
              </div>
            )}
            <div style={{ padding: '2rem', position: 'relative' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#333', position: 'absolute', top: '1rem', right: '1rem' }}>
                /{String(idx + 1).padStart(2, '0')}
              </span>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '0.8rem', color: '#cc1a1a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
                ID · {cat.id}
              </div>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 1.5rem', letterSpacing: '0.05em' }}>
                {cat.nombre.toUpperCase()}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => navigate(`/categorias/${cat.id}`)}
                  style={{ ...btnGhost, padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }}>
                  VER
                </button>
                <button onClick={() => abrirEditar(cat)}
                  style={{ ...btnGhost, padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }}>
                  EDITAR
                </button>
                <button onClick={() => eliminar.mutate(cat.id)}
                  style={{ backgroundColor: '#1a0000', color: '#cc1a1a', padding: '0.5rem 1rem', fontSize: '0.85rem', border: '1px solid #cc1a1a', cursor: 'pointer', fontFamily: 'Bebas Neue', letterSpacing: '0.1em', flex: 1 }}>
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', padding: '2.5rem', width: '460px' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 0.5rem' }}>
              // {editando ? 'MODIFICAR' : 'NUEVA'} CATEGORÍA
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', margin: '0 0 2rem' }}>
              {editando ? 'EDITAAR' : 'AGREGAR'} <span style={{ color: '#cc1a1a' }}>CATEGORÍA</span>
            </h2>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>NOMBRE</label>
            <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: BRASA" />
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a', letterSpacing: '0.15em' }}>URL DE IMAGEN (opcional)</label>
            <input style={inputStyle} value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} placeholder="https://..." />
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