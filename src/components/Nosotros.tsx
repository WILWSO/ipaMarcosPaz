import { creencias, iglesia } from '../data/contenido'
import { ArrowRight, Church, MapPin, MessageCircle } from 'lucide-react'

const accesos = [
  { href: iglesia.mapsUrl, titulo: 'Cómo llegar', texto: 'Encontrá nuestra ubicación y cómo llegar.', icono: MapPin, externo: true },
  { href: '#horarios', titulo: 'Nuestros cultos', texto: 'Conocé nuestros horarios y reuniones.', icono: Church },
  { href: '#contacto', titulo: 'Contactanos', texto: 'Dejanos tus datos y nos pondremos en contacto.', icono: MessageCircle },
]

export default function Nosotros() {
  return (
    <section id="nosotros" className="bg-white">
      <div className="border-b border-brand-100 bg-brand-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <h2 className="font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-2xl font-bold uppercase text-brand-800">¡Queremos conocerte!</h2>
            <p className="mx-auto mt-2 max-w-2xl text-brand-700">Si estás buscando una iglesia, querés conocer más acerca de la fe cristiana o simplemente querés visitarnos, ¡serás muy bienvenido!</p>
          </div>
          <div className="mt-8 grid divide-y divide-brand-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {accesos.map(({ href, titulo, texto, icono: Icono, externo }) => (
              <a key={titulo} href={href} target={externo ? '_blank' : undefined} rel={externo ? 'noopener noreferrer' : undefined} className="group flex items-center gap-4 px-4 py-5 md:px-8">
                <Icono className="h-10 w-10 shrink-0 text-brand-800" strokeWidth={1.8} aria-hidden="true" />
                <span><strong className="block text-sm uppercase text-brand-800">{titulo}</strong><span className="mt-1 block text-sm text-brand-600">{texto}</span></span>
                <ArrowRight className="ml-auto shrink-0 text-brand-700 transition group-hover:translate-x-1" size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.5fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase text-service-600">Quiénes somos</p>
            <h2 className="mt-3 font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-3xl font-bold uppercase text-brand-800">Una iglesia para glorificar a Dios</h2>
            <p className="mt-5 leading-7 text-brand-700">
            Somos una iglesia plantada por medio del proyecto PIPA de misión brasileña, que se reúne en{' '}
            {iglesia.ciudad} para adorar a Dios, escuchar su Palabra y servir a
            la ciudad. Creemos que el evangelio de Jesucristo transforma
            personas, familias y comunidades.
            </p>
            <p className="mt-4 leading-7 text-brand-700">
            Nuestras puertas están abiertas para todos: no importa tu historia ni
            en qué punto del camino estés, tenés un lugar entre nosotros.
            </p>
          </div>

          <figure className="overflow-hidden rounded-md border border-brand-100 bg-brand-800 shadow-sm">
            <img
              src="/oficiales-iglesia.webp"
              alt="Pastores, presbíteros y diáconos de la Iglesia Presbiteriana Argentina de Marcos Paz"
              className="h-auto w-full"
            />
            <figcaption className="flex flex-col gap-2 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase">Oficiales de la iglesia</h3>
                <p className="mt-1 text-sm text-brand-100">Pastores, presbíteros y diáconos al servicio de Cristo y de su Iglesia.</p>
              </div>
              <span className="shrink-0 text-sm font-bold uppercase text-service-500">Marcos Paz</span>
            </figcaption>
          </figure>
        </div>

        <div id="fe" className="mt-14 grid scroll-mt-24 gap-px overflow-hidden rounded-md bg-brand-200 sm:grid-cols-2 lg:grid-cols-4">
          {creencias.map((creencia) => (
            <article key={creencia.titulo} className="bg-brand-50 p-5">
              <h3 className="font-bold uppercase text-brand-800">{creencia.titulo}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-600">{creencia.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
