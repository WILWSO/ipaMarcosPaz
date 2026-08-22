import { enlaces } from '../data/contenido'
import { ArrowRight, CheckCircle2, Users } from 'lucide-react'

export default function Membresia() {
  return (
    <section id="membresia" className="bg-service-600 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[auto_1fr_auto] md:items-center md:px-6">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-service-700"><Users size={32} aria-hidden="true" /></div>
        <div>
          <p className="text-sm font-bold uppercase text-white/75">Da el próximo paso</p>
          <h2 className="mt-2 font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-2xl font-bold uppercase">¿Querés ser miembro de la iglesia?</h2>
          <p className="mt-2 max-w-2xl text-white/85">
            Completá la solicitud de membresía en línea y el consistorio se
            pondrá en contacto con vos para acompañarte en el proceso.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} />Membresía</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} />Bautismo</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} />Acompañamiento pastoral</span>
          </div>
        </div>
        <a
          href={enlaces.solicitudMembresia}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold uppercase text-service-700 transition hover:bg-brand-50"
        >
          Solicitar <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
