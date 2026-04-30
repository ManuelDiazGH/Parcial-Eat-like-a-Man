import { useNavigate } from 'react-router-dom'

import type { Categoria } from '../types'

interface CategoriaCardProps {
  categoria: Categoria
  index: number
  onEditar: (categoria: Categoria) => void
  onEliminar: (id: number) => void
}

const btnGhost: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#ede8df',
  padding: '0.5rem 1rem',
  fontFamily: 'Bebas Neue',
  fontSize: '0.85rem',
  letterSpacing: '0.1em',
  border: '1px solid #333',
  cursor: 'pointer',
  flex: 1,
}

export default function CategoriaCard({ categoria, index, onEditar, onEliminar }: CategoriaCardProps) {
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
      {categoria.imagen_url && (
        <div style={{ height: '160px', overflow: 'hidden' }}>
          <img
            src={categoria.imagen_url}
            alt={categoria.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
          />
        </div>
      )}

      <div style={{ padding: '2rem', position: 'relative' }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#333', position: 'absolute', top: '1rem', right: '1rem' }}>
          /{String(index + 1).padStart(2, '0')}
        </span>

        <div style={{ fontFamily: 'Bebas Neue', fontSize: '0.8rem', color: '#cc1a1a', letterSpacing: '0.2em', marginBottom: '0.25rem' }}>
          ID - {categoria.id}
        </div>

        {categoria.parent_id && (
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#9a9a8a', marginBottom: '0.25rem' }}>
            SUBCATEGORIA DE ID {categoria.parent_id}
          </div>
        )}

        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 1.5rem', letterSpacing: '0.05em' }}>
          {categoria.nombre.toUpperCase()}
        </h2>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate(`/categorias/${categoria.id}`)} style={btnGhost}>VER</button>
          <button onClick={() => onEditar(categoria)} style={btnGhost}>EDITAR</button>
          <button
            onClick={() => onEliminar(categoria.id)}
            style={{ backgroundColor: '#1a0000', color: '#cc1a1a', padding: '0.5rem 1rem', fontSize: '0.85rem', border: '1px solid #cc1a1a', cursor: 'pointer', fontFamily: 'Bebas Neue', letterSpacing: '0.1em', flex: 1 }}
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </div>
  )
}
