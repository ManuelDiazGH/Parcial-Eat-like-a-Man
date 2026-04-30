import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/productos', label: 'EL ARSENAL' },
    { to: '/categorias', label: 'CATEGORIAS' },
    { to: '/ingredientes', label: 'INGREDIENTES' },
  ]

  return (
    <nav
      style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between"
    >
      <Link to="/" className="flex items-center gap-2">
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/011/417/non_2x/bull-head-logo-icon-template-design-free-vector.jpg"
          alt="logo"
          style={{ width: '70px', height: '70px', objectFit: 'contain', filter: 'invert(1)' }}
        />
        <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '0.1em' }}>
          EAT LIKE A <span style={{ color: '#cc1a1a' }}>MAN</span>
        </span>
      </Link>

      <div className="flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: location.pathname.startsWith(link.to) ? '#cc1a1a' : '#ede8df',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
