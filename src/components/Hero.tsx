import { ArrowRight, Check, Clock3, LockKeyhole, MapPin, Users } from 'lucide-react'
import { enlaces, iglesia } from '../data/contenido'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="overflow-hidden bg-white text-white"
    >
      <div className="relative min-h-124 bg-brand-900 md:h-[calc(100svh-13rem)] md:max-h-124 md:min-h-96">
        <img
          src="/iglesia3.jpg"
          alt="Fachada de la Iglesia Presbiteriana Argentina de Marcos Paz"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-brand-900/70 md:bg-linear-to-r md:from-brand-900/95 md:via-brand-900/65 md:to-brand-900/20" />

        <div className="relative mx-auto flex min-h-124 max-w-7xl items-center px-5 py-12 md:h-full md:min-h-0 md:px-10 md:py-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-base font-bold uppercase text-brand-100 sm:text-lg">
              {iglesia.nombre} · {iglesia.ciudad}
            </p>
            <h1 className="max-w-2xl font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-3xl font-bold uppercase leading-[1.12] sm:text-4xl">
              Amar a Dios, servir a las personas,
              <span className="block">anunciar el Evangelio</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90 sm:text-xl">
              Una iglesia bíblica, reformada y comprometida con nuestra comunidad.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#nosotros" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold uppercase text-brand-900 transition hover:bg-brand-100">
                Conocé nuestra iglesia <ArrowRight aria-hidden="true" size={17} />
              </a>
              <a href="#contacto" className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-sm font-bold uppercase transition hover:bg-white hover:text-brand-900">
                Quiero visitarlos
              </a>
            </div>
            <div className="mt-7 flex flex-col gap-3 text-sm font-semibold sm:flex-row sm:gap-8">
              <span className="flex items-center gap-2"><MapPin size={18} aria-hidden="true" />{iglesia.direccion}</span>
              <span className="flex items-center gap-2"><Clock3 size={18} aria-hidden="true" />Culto: domingos 10:30 h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-2 md:gap-4 md:px-6">
        <a
          href={enlaces.areaPrivada}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="group flex min-h-20 items-center gap-4 rounded-md bg-brand-800 px-5 py-3 text-white transition hover:bg-brand-900 md:min-h-24 md:py-4"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 md:h-12 md:w-12"><LockKeyhole aria-hidden="true" size={24} /></span>
          <span className="text-left"><strong className="block text-lg uppercase">Área privada</strong><span className="hidden text-sm text-brand-100 md:block">Accedé a tu información y gestiones.</span></span>
          <ArrowRight className="ml-auto transition group-hover:translate-x-1" size={19} aria-hidden="true" />
        </a>
        <a
          href={enlaces.solicitudMembresia}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-20 items-center gap-4 rounded-md bg-service-600 px-5 py-3 text-white transition hover:bg-service-700 md:min-h-24 md:py-4"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 md:h-12 md:w-12"><Users aria-hidden="true" size={26} /></span>
          <span className="text-left"><strong className="block text-lg uppercase">Solicitud de membresía</strong><span className="hidden text-sm text-white/85 md:block">Solicitá membresía o bautismo.</span></span>
          <Check className="ml-auto" size={19} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
