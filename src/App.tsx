import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Nosotros from './components/Nosotros'
import Horarios from './components/Horarios'
import Ministerios from './components/Ministerios'
import Eventos from './components/Eventos'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import AreaPrivada from './components/AreaPrivada'
import Membresia from './components/Membresia'

export default function App() {
  if (window.location.pathname === '/area-privada') return <AreaPrivada />

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Nosotros />
        <Horarios />
        <Ministerios />
        <Eventos />
        <Membresia />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}
