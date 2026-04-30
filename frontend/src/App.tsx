// App queda liviano a propósito.
// Acá solo se arma el layout general.
// Navbar y rutas viven en sus archivos.

import Navbar from './components/Navbar'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <AppRouter />
      </div>
    </div>
  )
}
