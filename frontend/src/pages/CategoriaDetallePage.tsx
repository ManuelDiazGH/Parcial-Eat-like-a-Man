import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import type { Categoria, Producto } from '../types'

export default function CategoriaDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: categoria, isLoading: loadingCat } = useQuery<Categoria>({
    queryKey: ['categoria', id],
    queryFn: () => api.get(`/categorias/${id}`).then(r => r.data),
  })

  const { data: productos = [], isLoading: loadingProd } = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos/').then(r => r.data),
  })

  const productosDeCat = productos.filter(p => p.categorias.some(c => c.id === Number(id)))

  if (loadingCat || loadingProd) return <p style={{ padding: '4rem', fontFamily: 'JetBrains Mono', color: '#cc1a1a' }}>// CARGANDO...</p>

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        position: 'relative', height: '50vh', overflow: 'hidden',
        background: categoria?.imagen_url
          ? `linear-gradient(to top, #0a0a0a 20%, rgba(10,10,10,0.5) 100%), url(${categoria.imagen_url}) center/cover no-repeat`
          : '#111',
        display: 'flex', alignItems: 'flex-end', padding: '3rem 4rem'
      }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 0.5rem' }}>
            // CATEGORÍA · ID {id}
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(4rem, 10vw, 10rem)', lineHeight: 0.9, margin: 0 }}>
            {categoria?.nombre.toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Productos de esta categoría */}
      <div style={{ padding: '3rem 4rem' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#cc1a1a', letterSpacing: '0.2em', margin: '0 0 1rem' }}>
          // {productosDeCat.length.toString().padStart(2, '0')} PRODUCTOS EN ESTA CATEGORÍA
        </p>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', margin: '0 0 2rem' }}>
          EL <span style={{ color: '#cc1a1a' }}>ARSENAL</span>
        </h2>

        {productosDeCat.length === 0
          ? <p style={{ fontFamily: 'Oswald', color: '#444' }}>SIN PRODUCTOS EN ESTA CATEGORÍA</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', backgroundColor: '#1a1a1a' }}>
            {productosDeCat.map(p => (
              <div key={p.id} onClick={() => navigate(`/productos/${p.id}`)}
                style={{ backgroundColor: '#0f0f0f', cursor: 'pointer', overflow: 'hidden' }}>
                {(p.imagen_url || true) && (
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={p.imagen_url || `https://images.unsplash.com/photo-1558030006-450675393462?w=600`}
                      alt={p.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                    />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>
                    {p.nombre.toUpperCase()}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: '#cc1a1a' }}>
                      ${p.precio.toFixed(2)}
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.1em',
                      color: p.disponible ? '#55cc00' : '#cc1a1a',
                      border: `1px solid ${p.disponible ? '#55cc00' : '#cc1a1a'}`,
                      padding: '0.2rem 0.5rem'
                    }}>
                      {p.disponible ? '● DISPONIBLE' : '● AGOTADO'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      <div style={{ padding: '0 4rem 4rem' }}>
        <button onClick={() => navigate('/categorias')} style={{
          backgroundColor: 'transparent', color: '#ede8df',
          padding: '0.75rem 2rem', fontFamily: 'Bebas Neue',
          fontSize: '1.1rem', letterSpacing: '0.1em',
          border: '1px solid #333', cursor: 'pointer'
        }}>
         VOLVER A CLASIFICACIONES
        </button>
      </div>
    </div>
  )
}