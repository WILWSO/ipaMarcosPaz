import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Nosotros from './components/Nosotros'
import Horarios from './components/Horarios'
import Ministerios from './components/Ministerios'
import Eventos from './components/Eventos'
import Contacto from './components/Contacto'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Nosotros />
        <Horarios />
        <Ministerios />
        <Eventos />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}
