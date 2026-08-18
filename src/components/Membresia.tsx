import { enlaces } from '../data/contenido'

export default function Membresia() {
  return (
    <section id="membresia" className="bg-brand-800 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">¿Querés ser miembro de la iglesia?</h2>
          <p className="mt-2 max-w-2xl text-brand-100">
            Completá la solicitud de membresía en línea y el consistorio se
            pondrá en contacto con vos para acompañarte en el proceso.
          </p>
        </div>
        <a
          href={enlaces.solicitudMembresia}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-accent-500 px-7 py-3 font-semibold text-brand-900 transition hover:bg-accent-400"
        >
          Solicitud de Membresía y bautismos
        </a>
      </div>
    </section>
  )
}
