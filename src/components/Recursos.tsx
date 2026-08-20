import { enlaces, identidad } from '../data/contenido'

export default function Recursos() {
  return (
    <section id="recursos" className="bg-brand-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
            Liderazgo y formación
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-brand-800">
            Una iglesia que aprende y sirve
          </h2>
          <p className="mt-4 text-brand-600">
            Conocé algunos espacios de formación y publicación que acompañan la
            vida de la iglesia.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100">
            <img
              src={identidad.mints}
              alt="Credencial de MINTS de Wilton Santos de Oliveira"
              className="h-80 w-full object-cover object-top"
            />
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
                Formación teológica
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-brand-800">
                MINTS en Argentina
              </h3>
              <p className="mt-3 text-sm leading-6 text-brand-600">
                El pastor Wilton Santos de Oliveira es Coordinador Nacional de
                MINTS en Argentina, promoviendo la formación teológica y el
                servicio cristiano.
              </p>
              <a
                href="https://mintsespanol.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex font-semibold text-brand-700 underline decoration-accent-500 underline-offset-4 hover:text-accent-600"
              >
                Conocer MINTS
              </a>
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2">
            <a
              href={enlaces.setres}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100 transition hover:-translate-y-1"
            >
              <img
                src={identidad.setres}
                alt="SETRES - Seminario Teológico Reformado Sudamericano"
                className="h-48 w-full object-contain bg-white p-8"
              />
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
                  Seminario
                </p>
                <h3 className="mt-2 text-xl font-semibold text-brand-800">SETRES</h3>
                <p className="mt-2 text-sm text-brand-600">
                  Seminario Teológico Reformado Sudamericano.
                </p>
                <span className="mt-4 inline-block font-semibold text-brand-700">
                  Visitar setres.org →
                </span>
              </div>
            </a>

            <a
              href={enlaces.editorial}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100 transition hover:-translate-y-1"
            >
              <img
                src={identidad.editorial}
                alt="Editorial Castillo Fuerte"
                className="h-48 w-full object-contain bg-white object-center p-4"
              />
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
                  Editorial
                </p>
                <h3 className="mt-2 text-xl font-semibold text-brand-800">
                  Castillo Fuerte
                </h3>
                <p className="mt-2 text-sm text-brand-600">
                  Libros y recursos cristianos para la iglesia.
                </p>
                <span className="mt-4 inline-block font-semibold text-brand-700">
                  Instagram @editorialcastillofuerte →
                </span>
              </div>
            </a>

          </div>
        </div>
      </div>
    </section>
  )
}
