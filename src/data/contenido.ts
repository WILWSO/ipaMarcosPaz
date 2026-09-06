export const iglesia = {
  nombre: 'IGLESIA PRESBITERIANA ARGENTINA',
  ciudad: 'Marcos Paz',
  provincia: 'Buenos Aires',
  lema: 'Una comunidad centrada en Cristo, la Palabra y el amor al prójimo.',
  direccion: 'Sarmiento 1665, Marcos Paz, Buenos Aires',
  telefono: '+54 11 2601 1240',
  email: 'secretaria@ipamarcospaz.org',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sarmiento+1665%2C+Marcos+Paz%2C+Buenos+Aires',
  redes: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://www.youtube.com/channel/UCs_rRVEdme4E6PLgFNOO86w',
    editorial: 'https://www.instagram.com/editorialcastillofuerte/',
    pastor: 'https://www.instagram.com/pastorwiltonsantos/',
  },
}

export const enlaces = {
  areaPrivada: `${import.meta.env.VITE_IGLESIANET_URL ?? 'https://www.iglesianet.org'}/i/ipamarcospaz`,
  setres: 'https://setres.org',
  editorial: 'https://www.instagram.com/editorialcastillofuerte/',
  // Formulario público, sin login, con IPA Marcos Paz preseleccionada.
  solicitudMembresia: `${import.meta.env.VITE_IGLESIANET_URL ?? 'https://www.iglesianet.org'}/membership-request?client_id=ipamarcospaz&tenant=09d5d211-1f6a-46a4-8a17-b5277d017e34`,
}

export const identidad = {
  logo: '/ipamp.png',
  familiaPastoral: '/familia-pastoral-completa.webp',
  editorial: '/castillo_fuerte.jpeg',
  setres: '/Setres.svg',
}

export const horarios = [
  {
    dia: 'Domingo',
    hora: '10:30 hs',
    titulo: 'Culto de adoración',
    detalle: 'Culto general.',
  },
  {
    dia: 'Sábado',
    hora: '10:30 hs',
    titulo: 'CAFE - Centro de Atención Familiar y Espiritual',
    detalle:
      'Compartimos alimentos, ropa y otros recursos, junto con atención médica, psicológica, peluquería y servicios para la comunidad.',
  },
  {
    dia: 'Sábado',
    hora: '19:30 hs',
    titulo: 'Conectados',
    detalle: 'Encuentro de UPA y UPJ para adolescentes y jóvenes.',
  },
  {
    dia: 'Miércoles',
    hora: '19:30 a 20:30 hs',
    titulo: 'Oración y enseñanza bíblica',
    detalle: 'Encuentro semanal de oración y enseñanza bíblica.',
  },
]

export const ministerios = [
  {
    titulo: 'Conectados',
    descripcion:
      'UPA - Unión Presbiteriana de Adolescentes. Un espacio de encuentro, amistad y formación para adolescentes.',
  },
  {
    titulo: 'UPJ - Unión Presbiteriana de Jóvenes',
    descripcion:
      'Discipulado, retiros y espacios de amistad para crecer juntos en la fe.',
  },
  {
    titulo: 'CAFE',
    descripcion:
      'Centro de Atención Familiar y Espiritual: acompañamiento y servicios para las necesidades de la comunidad.',
  },
  {
    titulo: 'Misiones',
    descripcion:
      'Apoyo a la plantación de iglesias y a misioneros dentro y fuera del país.',
  },
  {
    titulo: 'Matrimonios y Familias',
    descripcion:
      'Acompañamiento y formación para hogares que buscan honrar a Dios.',
  },
  {
    titulo: 'Alabanza',
    descripcion:
      'Equipo de músicos y cantores que sirven en los cultos dominicales.',
  },
  {
    titulo: 'SAF - Sociedad Auxiliadora Femenina',
    descripcion:
      'Comunión, acompañamiento y servicio de las mujeres de la iglesia.',
  },
  {
    titulo: 'UPH - Unión Presbiteriana de Hombres',
    descripcion:
      'Comunión, formación y servicio de los hombres de la iglesia.',
  },
  {
    titulo: 'UPN - Unión Presbiteriana de Niños y Preadolescentes',
    descripcion:
      'Enseñanza bíblica y acompañamiento para niños y preadolescentes.',
  },
]

export const creencias = [
  {
    titulo: 'Las Escrituras',
    texto:
      'La Biblia es la Palabra inspirada de Dios, única regla infalible de fe y conducta.',
  },
  {
    titulo: 'Solo Cristo',
    texto:
      'Jesucristo es el único mediador entre Dios y los hombres, y el Señor de su Iglesia.',
  },
  {
    titulo: 'Solo la gracia',
    texto:
      'La salvación es un don de Dios recibido por la fe, no por méritos humanos.',
  },
  {
    titulo: 'Herencia reformada',
    texto:
      'Confesamos la fe expresada en la Confesión de Fe de Westminster y sus catecismos.',
  },
]
