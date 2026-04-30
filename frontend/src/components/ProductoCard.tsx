import { useNavigate } from 'react-router-dom'

import type { Producto } from '../types'

interface ProductoCardProps {
  producto: Producto
  index: number
  onEditar: (producto: Producto) => void
  onEliminar: (id: number) => void
}

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1558030006-450675393462?w=600',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
]

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

function getImage(id: number) {
  return FOOD_IMAGES[id % FOOD_IMAGES.length]
}

export default function ProductoCard({ producto, index, onEditar, onEliminar }: ProductoCardProps) {
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: '#0f0f0f', position: 'relative', opacity: producto.disponible ? 1 : 0.5 }}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#444', zIndex: 1 }}>
        /{String(index + 1).padStart(2, '0')}
      </div>

      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
        <span
          style={{
            backgroundColor: producto.disponible ? '#1a3300' : '#1a0000',
            color: producto.disponible ? '#55cc00' : '#cc1a1a',
            padding: '0.2rem 0.6rem',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            border: `1px solid ${producto.disponible ? '#55cc00' : '#cc1a1a'}`,
          }}
        >
          {producto.disponible ? 'DISPONIBLE' : 'AGOTADO'}
        </span>
      </div>

      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
        <img src={producto.imagen_url || getImage(producto.id)} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
        {producto.categorias[0] && (
          <span style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: '#cc1a1a', color: '#fff', padding: '0.2rem 0.6rem', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            {producto.categorias[0].nombre.toUpperCase()}
          </span>
        )}
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 0.25rem', letterSpacing: '0.05em' }}>
          {producto.nombre.toUpperCase()}
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: '#cc1a1a' }}>${producto.precio.toFixed(2)}</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9a9a8a' }}>STOCK: {producto.stock}</span>
        </div>

        {producto.ingredientes.length > 0 && (
          <p style={{ fontFamily: 'Oswald', fontSize: '0.9rem', color: '#9a9a8a', margin: '0 0 1rem' }}>
            {producto.ingredientes.map((ingrediente) => ingrediente.nombre).join(' / ')}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button onClick={() => navigate(`/productos/${producto.id}`)} style={btnGhost}>VER</button>
          <button onClick={() => onEditar(producto)} style={btnGhost}>EDITAR</button>
          <button
            onClick={() => onEliminar(producto.id)}
            style={{ backgroundColor: '#1a0000', color: '#cc1a1a', padding: '0.5rem 1rem', fontSize: '0.85rem', border: '1px solid #cc1a1a', cursor: 'pointer', fontFamily: 'Bebas Neue', letterSpacing: '0.1em', flex: 1 }}
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </div>
  )
}
