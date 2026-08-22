import { enlaces, identidad } from '../data/contenido'
import {
  ArrowUpRight,
  BookOpen,
  Camera,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Users,
} from 'lucide-react'

export default function Recursos() {
  return (
    <section id="recursos" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <article className="overflow-hidden rounded-lg border border-brand-100 bg-brand-50 shadow-sm lg:grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-brand-800 text-white"><HeartHandshake size={29} strokeWidth={1.7} aria-hidden="true" /></span>
              <div>
                <p className="text-sm font-bold uppercase text-brand-700">Nuestra familia pastoral</p>
                <h3 className="mt-2 text-2xl font-bold text-brand-900 sm:text-3xl">Pastor Wilton Santos de Oliveira y familia</h3>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-lg leading-8 text-brand-700">Pastor de nuestra iglesia y comprometido con la enseñanza de la Palabra, el cuidado de la congregación y la formación de líderes para el servicio del Reino.</p>

            <div className="mt-7 grid gap-4 rounded-lg border border-brand-100 bg-white p-5 sm:grid-cols-3 sm:divide-x sm:divide-brand-100">
              <span className="flex items-center gap-3 text-sm font-medium text-brand-800"><BookOpen className="shrink-0 text-brand-700" size={23} aria-hidden="true" />Enseñanza fiel de la Palabra</span>
              <span className="flex items-center gap-3 text-sm font-medium text-brand-800 sm:pl-4"><Users className="shrink-0 text-brand-700" size={23} aria-hidden="true" />Cuidado pastoral de la congregación</span>
              <span className="flex items-center gap-3 text-sm font-medium text-brand-800 sm:pl-4"><HandHeart className="shrink-0 text-brand-700" size={23} aria-hidden="true" />Formación de líderes para el servicio</span>
            </div>
          </div>

          <div className="h-80 overflow-hidden bg-brand-50 lg:h-auto lg:min-h-full">
            <img
              src={identidad.familiaPastoral}
              alt="Pastor Wilton Santos de Oliveira junto a su familia"
              className="h-full w-full object-contain object-center"
            />
          </div>
        </article>

        <div className="mt-12">
          <div className="flex items-center justify-center gap-4 text-center">
            <span className="h-0.5 w-7 bg-brand-700" />
            <h3 className="font-['Arial_Narrow','Aptos_Narrow',sans-serif] text-xl font-bold uppercase text-brand-800">Alianzas que fortalecen nuestra misión</h3>
            <span className="h-0.5 w-7 bg-brand-700" />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <a
              href={enlaces.setres}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="grid min-h-60 place-items-center border-b border-brand-100 p-3 sm:border-r sm:border-b-0">
                <img
                  src={identidad.setres}
                  alt="SETRES - Seminario Teológico Reformado Sudamericano"
                  className="h-52 w-full object-contain"
                />
              </div>
              <div className="flex flex-col p-6">
                <p className="flex items-center gap-2 text-sm font-bold uppercase text-brand-700"><GraduationCap size={19} aria-hidden="true" />Seminario</p>
                <h4 className="mt-4 text-2xl font-bold text-brand-900">SETRES</h4>
                <p className="mt-2 text-sm leading-6 text-brand-600">Formando siervos de Dios con una educación teológica sólida, bíblica y reformada para la iglesia y el mundo.</p>
                <span className="mt-6 flex items-center justify-center gap-2 rounded-md bg-brand-800 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-brand-900 sm:mt-auto">Visitar setres.org <ArrowUpRight size={17} /></span>
              </div>
            </a>

            <a
              href={enlaces.editorial}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="grid min-h-60 place-items-center border-b border-brand-100 bg-white p-3 sm:border-r sm:border-b-0">
                <img
                  src={identidad.editorial}
                  alt="Editorial Castillo Fuerte"
                  className="h-52 w-full object-contain object-center"
                />
              </div>
              <div className="flex flex-col p-6">
                <p className="flex items-center gap-2 text-sm font-bold uppercase text-brand-700"><BookOpen size={19} aria-hidden="true" />Editorial</p>
                <h4 className="mt-4 text-2xl font-bold text-brand-900">Castillo Fuerte</h4>
                <p className="mt-2 text-sm leading-6 text-brand-600">Recursos bíblicos y teológicos que edifican, enseñan y fortalecen la vida cristiana.</p>
                <span className="mt-6 flex items-center justify-center gap-2 rounded-md bg-brand-800 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-brand-900 sm:mt-auto"><Camera size={17} aria-hidden="true" />@editorialcastillofuerte <ArrowUpRight size={17} /></span>
              </div>
            </a>
          </div>
        </div>

        <blockquote className="mt-5 flex items-center gap-4 rounded-lg bg-brand-800 px-6 py-5 text-white">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-brand-800"><BookOpen size={24} aria-hidden="true" /></span>
          <p><span className="font-serif text-lg italic">«Todo lo puedo en Cristo que me fortalece.»</span><span className="mt-1 block text-sm text-brand-200">Filipenses 4:13</span></p>
        </blockquote>
      </div>
    </section>
  )
}
