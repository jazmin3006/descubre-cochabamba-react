export const places = [
  {
    name: 'Cristo de la Concordia',
    category: 'Cultura',
    location: 'San Pedro, Cochabamba',
    time: '1–2 horas',
    price: 'Consultar tarifa de acceso',
    rating: '4.8',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOwRCcJhT41ZbIgAllbev247FBrHc7vh7vaBlD6rOsmg&s=10',
    description: 'Uno de los símbolos más reconocidos de Cochabamba. Su mirador permite disfrutar una vista panorámica de la ciudad y sus alrededores.',
  },
  {
    name: 'Laguna Angostura',
    category: 'Naturaleza',
    location: 'Valle Alto, Cochabamba',
    time: '2–4 horas',
    price: 'Acceso variable según actividad',
    rating: '4.5',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/00/03/93/cam01225-largejpg.jpg?w=1200&h=-1&s=1',
    description: 'Destino ideal para descansar y disfrutar del paisaje. Sus alrededores permiten realizar actividades recreativas y pasar una jornada al aire libre.',
  },
  {
    name: 'Palacio Portales',
    category: 'Historia',
    location: 'Queru Queru, Cochabamba',
    time: '1–2 horas',
    price: 'Consultar tarifa de visita',
    rating: '4.7',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoEfQmuvgnxX4LzWQCqqGa-9xbT1VPB6s1mN3lmrhbwQ&s=10',
    description: 'Edificio patrimonial reconocido por su arquitectura, jardines y valor cultural. Una visita recomendada para conocer parte de la historia de la ciudad.',
  },
  {
    name: 'Parque Nacional Tunari',
    category: 'Aventura',
    location: 'Cordillera del Tunari',
    time: '3–6 horas',
    price: 'Según ruta y actividad',
    rating: '4.7',
    image: 'https://www.laregion.bo/wp-content/uploads/2022/08/tunari.jpg',
    description: 'Área natural con montañas y paisajes para caminatas, contemplación y aventura. La duración depende del recorrido elegido.',
  },
  {
    name: 'Plaza 14 de Septiembre',
    category: 'Cultura',
    location: 'Centro histórico',
    time: '1 hora',
    price: 'Gratuito',
    rating: '4.6',
    image: 'https://thumbs.dreamstime.com/b/de-septiembre-y-catedral-metropolitana-cochabamba-bolivia-foto-alta-calidad-238478276.jpg',
    description: 'Corazón del centro histórico de Cochabamba, rodeado de arquitectura representativa, espacios públicos y puntos de interés urbano.',
  },
  {
    name: 'Convento de Santa Teresa',
    category: 'Historia',
    location: 'Centro de Cochabamba',
    time: '1–2 horas',
    price: 'Consultar tarifa de visita',
    rating: '4.6',
    image: 'https://www.laregion.bo/wp-content/uploads/2015/10/Santa_Teresa.jpg',
    description: 'Patrimonio histórico y arquitectónico del centro de Cochabamba. Su recorrido permite conocer parte de la historia y arquitectura colonial.',
  },
]

export const categories = ['Todos', 'Cultura', 'Naturaleza', 'Historia', 'Aventura']

export const recommendedRoutes = {
  cultural: ['Plaza 14 de Septiembre', 'Palacio Portales', 'Convento de Santa Teresa'],
  naturaleza: ['Laguna Angostura', 'Parque Nacional Tunari'],
  aventura: ['Parque Nacional Tunari', 'Laguna Angostura'],
}

export const routeStorageKey = 'cochaRoute'
export const reservationStorageKey = 'cochaReservations'

export function getToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function readStoredArray(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}