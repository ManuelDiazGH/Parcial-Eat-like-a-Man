import type { Categoria } from '../types'

interface CategoriaModalProps {
  editando: Categoria | null
  categorias: Categoria[]
  nombre: string
  setNombre: (value: string) => void
  imagenUrl: string
  setImagenUrl: (value: string) => void
  parentId: number | null
  setParentId: (value: number | null) => void
  onConfirmar: () => void
  onCancelar: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333',
  color: '#ede8df',
  fontFamily: 'Oswald',
  fontSize: '1rem',
  outline: 'none',
  marginBottom: '1rem',
}

const btnRed: React.CSSProperties = {
  backgroundColor: '#cc1a1a',
  color: '#fff',
  padding: '0.75rem 2rem',
  fontFamily: 'Bebas Neue',
  fontSize: '1.1rem',
  letterSpacing: '0.1em',
  border: 'none',
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#ede8df',
  padding: '0.75rem 2rem',
  fontFamily: 'Bebas Neue',
  fontSize: '1.1rem',
  letterSpacing: '0.1em',
  border: '1px solid #333',
  cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono',
  fontSize: '0.7rem',
  color: '#9a9a8a',
  letterSpacing: '0.15em',
  display: 'block',
  marginBottom: '0.4rem',
}

export default function CategoriaModal({
  editando,
  categorias,
  nombre,
  setNombre,
  imagenUrl,
  setImagenUrl,
  parentId,
  setParentId,
  onConfirmar,
  onCancelar,
}: CategoriaModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', padding: '2.5rem', width: '460px' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 0.5rem' }}>
          // {editando ? 'MODIFICAR' : 'NUEVA'} CATEGORIA
        </p>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', margin: '0 0 2rem' }}>
          {editando ? 'EDITAR' : 'AGREGAR'} <span style={{ color: '#cc1a1a' }}>CATEGORIA</span>
        </h2>

        <label style={labelStyle}>NOMBRE</label>
        <input style={inputStyle} value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Ej: BRASA" />

        <label style={labelStyle}>URL DE IMAGEN (opcional)</label>
        <input style={inputStyle} value={imagenUrl} onChange={(event) => setImagenUrl(event.target.value)} placeholder="https://..." />

        <label style={labelStyle}>CATEGORIA PADRE (opcional - crea una Subcategoria)</label>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={parentId ?? ''}
          onChange={(event) => setParentId(event.target.value ? Number(event.target.value) : null)}
        >
          <option value="">- Sin categoria padre (es raiz) -</option>
          {categorias
            .filter((categoria) => categoria.id !== editando?.id)
            .map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
        </select>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button onClick={onCancelar} style={btnGhost}>CANCELAR</button>
          <button onClick={onConfirmar} style={btnRed}>{editando ? 'GUARDAR' : 'AGREGAR'}</button>
        </div>
      </div>
    </div>
  )
}
