import type { Ingrediente } from '../types'

interface IngredienteCardProps {
  ingrediente: Ingrediente
  index: number
  onEditar: (ingrediente: Ingrediente) => void
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

export default function IngredienteCard({ ingrediente, index, onEditar, onEliminar }: IngredienteCardProps) {
  return (
    <div style={{ backgroundColor: '#0f0f0f', padding: '2rem', position: 'relative' }}>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#333', position: 'absolute', top: '1rem', right: '1rem' }}>
        /{String(index + 1).padStart(2, '0')}
      </span>

      <div style={{ fontFamily: 'Bebas Neue', fontSize: '0.8rem', color: '#b45a00', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
        ID - {ingrediente.id}
      </div>

      <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 1.5rem', letterSpacing: '0.05em' }}>
        {ingrediente.nombre.toUpperCase()}
      </h2>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => onEditar(ingrediente)} style={btnGhost}>EDITAR</button>
        <button
          onClick={() => onEliminar(ingrediente.id)}
          style={{ backgroundColor: '#1a0000', color: '#cc1a1a', padding: '0.5rem 1rem', fontSize: '0.85rem', border: '1px solid #cc1a1a', cursor: 'pointer', fontFamily: 'Bebas Neue', letterSpacing: '0.1em', flex: 1 }}
        >
          ELIMINAR
        </button>
      </div>
    </div>
  )
}
