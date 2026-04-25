import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import type { Producto } from '../types'

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1558030006-450675393462?w=1200',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200',
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1200',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
]

const getImage = (id: number) => FOOD_IMAGES[id % FOOD_IMAGES.length]

export default function ProductoDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: producto, isLoading, isError } = useQuery<Producto>({
    queryKey: ['producto', id],
    queryFn: () => api.get(`/productos/${id}`).then(r => r.data),
  })

  if (isLoading) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// CARGANDO...</p>
  if (isError || !producto) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// ERROR DE CONEXIÓN</p>

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero imagen */}
      <div style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
        <img
          src={producto.imagen_url || getImage(producto.id)}
          alt={producto.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 20%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '3rem', left: '4rem' }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 0.5rem' }}>
            // FICHA DE PRODUCTO · ID {producto.id}
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(4rem, 10vw, 10rem)', lineHeight: 0.9, margin: 0 }}>
            {producto.nombre.toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '3rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        {/* Categorías */}
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 1rem' }}>
            // CLASIFICACIÓN
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 1rem' }}>CATEGORÍAS</h2>
          {producto.categorias.length === 0
            ? <p style={{ color: '#444', fontFamily: 'Oswald' }}>SIN CATEGORÍAS</p>
            : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {producto.categorias.map(c => (
                <span key={c.id} style={{
                  backgroundColor: '#cc1a1a', color: '#fff',
                  padding: '0.4rem 1rem', fontFamily: 'Bebas Neue',
                  fontSize: '1rem', letterSpacing: '0.1em'
                }}>
                  {c.nombre.toUpperCase()}
                </span>
              ))}
            </div>
          }
        </div>

        {/* Ingredientes */}
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#b45a00', letterSpacing: '0.2em', margin: '0 0 1rem' }}>
            // COMPOSICIÓN
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 1rem' }}>INGREDIENTES</h2>
          {producto.ingredientes.length === 0
            ? <p style={{ color: '#444', fontFamily: 'Oswald' }}>SIN INGREDIENTES</p>
            : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {producto.ingredientes.map(i => (
                <span key={i.id} style={{
                  border: '1px solid #b45a00', color: '#b45a00',
                  padding: '0.4rem 1rem', fontFamily: 'Bebas Neue',
                  fontSize: '1rem', letterSpacing: '0.1em'
                }}>
                  {i.nombre.toUpperCase()}
                </span>
              ))}
            </div>
          }
        </div>
      </div>

      {/* Volver */}
      <div style={{ padding: '0 4rem 4rem' }}>
        <button onClick={() => navigate('/productos')} style={{
          backgroundColor: 'transparent', color: '#ede8df',
          padding: '0.75rem 2rem', fontFamily: 'Bebas Neue',
          fontSize: '1.1rem', letterSpacing: '0.1em',
          border: '1px solid #333', cursor: 'pointer'
        }}>
          ← VOLVER AL ARSENAL
        </button>
      </div>
    </div>
  )
}