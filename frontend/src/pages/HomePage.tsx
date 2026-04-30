// Esta home salió de App para que App no junte de todo.
// Así la página queda separada y más fácil de leer.

import { Link } from 'react-router-dom'
import heroVideo from '../assets/larry_wheels_lift_edit..mp4'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a' }}>
      {/* Bloque principal */}
      <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 4rem', paddingTop: '80px', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.88) 50%, rgba(10,10,10,0.55) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p className="mono" style={{ color: '#cc1a1a', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>
            // NO PARA LOS DÉBILES — EST. 2024
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(5rem, 14vw, 14rem)', lineHeight: 0.9, margin: 0, color: '#fff' }}>
            COME<br />COMO<br /><span style={{ color: '#cc1a1a' }}>UN HOMBRE</span>
          </h1>
          <p style={{ marginTop: '2rem', maxWidth: '400px', color: '#9a9a8a', fontFamily: 'Oswald' }}>
            Carne sin disculpas. Combustible para los que no aceptan menos.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Link to="/productos" style={{ backgroundColor: '#cc1a1a', color: '#fff', padding: '0.75rem 2rem', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
              VER EL ARSENAL →
            </Link>
            <Link to="/categorias" style={{ border: '1px solid #ede8df', color: '#ede8df', padding: '0.75rem 2rem', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
              CATEGORÍAS
            </Link>
          </div>
        </div>
      </div>

      {/* Franja animada */}
      <div style={{ backgroundColor: '#cc1a1a', padding: '0.75rem 0', overflow: 'hidden' }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} style={{ display: 'flex' }}>
              {['SIN PIEDAD', 'FUEGO REAL', 'CERO EXCUSAS', 'BRASA O NADA', 'SOLO PROTEÍNA', 'SIN DISCULPAS', 'FUEGO REAL', 'SIN MIEDO'].map((t, i) => (
                <span key={i} style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: '0.2em', marginRight: '3rem', whiteSpace: 'nowrap' }}>
                  ⚡ {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Números rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid #1a1a1a' }}>
        {[
          { n: '12K+', label: 'HOMBRES ALIMENTADOS' },
          { n: '60', label: 'DÍAS DE MADURACIÓN MÍNIMA' },
          { n: '100%', label: 'ORIGEN VERIFICADO' },
          { n: '0', label: 'CONSERVANTES SIEMPRE' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '3rem 2rem', borderRight: i < 3 ? '1px solid #1a1a1a' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', color: '#cc1a1a' }}>{s.n}</div>
            <div className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#9a9a8a', marginTop: '0.5rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bloque de reglas */}
      <div style={{ padding: '6rem 4rem', borderTop: '1px solid #1a1a1a' }}>
        <p className="mono" style={{ color: '#cc1a1a', fontSize: '0.75rem', letterSpacing: '0.2em' }}>// MANIFIESTO</p>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 6vw, 6rem)', lineHeight: 1, margin: '1rem 0 3rem' }}>
          CUATRO REGLAS.<br /><span style={{ color: '#cc1a1a' }}>CERO EXCEPCIONES.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: '#1a1a1a' }}>
          {[
            { n: 'I', title: 'SIN MIEDO', desc: 'Si dudás del corte, no sos el cliente.' },
            { n: 'II', title: 'SIN AZÚCAR', desc: 'Cero rellenos, cero conservantes. Solo proteína.' },
            { n: 'III', title: 'SIN PIEDAD', desc: 'El fuego no negocia. La parrilla no perdona.' },
            { n: 'IV', title: 'SIN LÍMITES', desc: 'Del rancho a tu plato en menos de 72 horas.' },
          ].map((r, i) => (
            <div key={i} style={{ backgroundColor: '#0f0f0f', padding: '2.5rem' }}>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: '#cc1a1a' }}>{r.n}</span>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', margin: '0.5rem 0' }}>{r.title}</h3>
              <p style={{ color: '#9a9a8a', fontFamily: 'Oswald', margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
