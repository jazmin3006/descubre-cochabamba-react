import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  categories,
  getToday,
  places,
  readStoredArray,
  recommendedRoutes,
  reservationStorageKey,
  routeStorageKey,
} from './data/places.js'

const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/

function PlaceImage({ place, modal = false }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`place-image${modal ? ' modal-image' : ''}${failed ? ' image-error' : ''}`}>
      {!failed && (
        <img
          src={place.image}
          alt={`Fotografía de ${place.name}`}
          loading={modal ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      )}
      {failed && <span aria-hidden="true">{place.name}</span>}
      {!modal && <span className="image-label">{place.category.toUpperCase()}</span>}
    </div>
  )
}

function PlaceCard({ place, onInfo, onAdd }) {
  return (
    <article className="card">
      <PlaceImage place={place} />
      <div className="card-body">
        <div className="card-top">
          <span className="mini-category">{place.category}</span>
          <span className="rating">★ {place.rating}</span>
        </div>
        <h3>{place.name}</h3>
        <p className="card-description">{place.description}</p>
        <p className="location">{place.location}</p>
        <div className="card-meta">
          <span>{place.time}</span>
          <span>{place.price}</span>
        </div>
        <div className="card-actions">
          <button className="info-btn" onClick={() => onInfo(place)} type="button">Ver información</button>
          <button className="add-btn" onClick={() => onAdd(place.name)} type="button">+ Recorrido</button>
        </div>
      </div>
    </article>
  )
}

function DestinationModal({ place, isAdded, onClose, onAdd }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!place) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [place, onClose])

  if (!place) return null

  return (
    <div className="modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button ref={closeButtonRef} className="close" onClick={onClose} type="button" aria-label="Cerrar">×</button>
        <PlaceImage place={place} modal />
        <p className="eyebrow">INFORMACIÓN DEL DESTINO</p>
        <h2 id="modalTitle">{place.name}</h2>
        <p>{place.description}</p>
        <div className="modal-details">
          <div><strong>Categoría</strong><span>{place.category}</span></div>
          <div><strong>Ubicación</strong><span>{place.location}</span></div>
          <div><strong>Tiempo recomendado</strong><span>{place.time}</span></div>
          <div><strong>Costo</strong><span>{place.price}</span></div>
          <div><strong>Valoración</strong><span>★ {place.rating}</span></div>
        </div>
        <div className="modal-actions">
          <button className="btn secondary" onClick={onClose} type="button">Cerrar</button>
          <button className="btn primary" onClick={() => onAdd(place.name)} type="button">
            {isAdded ? 'Ya está en tu recorrido' : 'Agregar al recorrido'}
          </button>
        </div>
      </section>
    </div>
  )
}

const initialBooking = {
  place: '',
  date: '',
  time: '',
  people: '2',
  name: '',
  email: '',
  phone: '',
}

function BookingSection() {
  const [form, setForm] = useState(initialBooking)
  const [feedback, setFeedback] = useState(null)
  const fieldRefs = useRef({})
  const today = getToday()

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setFeedback(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    let invalidField = ''
    let error = ''

    if (!form.place) [invalidField, error] = ['place', 'Selecciona un destino turístico.']
    else if (!form.date || form.date < getToday()) [invalidField, error] = ['date', 'Selecciona una fecha válida. No puedes reservar una fecha anterior a hoy.']
    else if (!form.time) [invalidField, error] = ['time', 'Selecciona un horario.']
    else if (!Number.isInteger(Number(form.people)) || Number(form.people) < 1 || Number(form.people) > 15) [invalidField, error] = ['people', 'La cantidad de personas debe estar entre 1 y 15.']
    else if (name.length < 3 || !namePattern.test(name)) [invalidField, error] = ['name', 'Ingresa un nombre válido.']
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) [invalidField, error] = ['email', 'Ingresa un correo electrónico válido.']
    else if (!/^\d{8}$/.test(form.phone)) [invalidField, error] = ['phone', 'El teléfono debe tener exactamente 8 dígitos.']

    if (error) {
      setFeedback({ type: 'error', text: error })
      fieldRefs.current[invalidField]?.focus()
      return
    }

    const reservation = {
      code: `COCHA-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      name,
      place: form.place,
      date: form.date,
      time: form.time,
      people: Number(form.people),
      email,
      phone: form.phone,
      createdAt: new Date().toISOString(),
    }

    const reservations = readStoredArray(reservationStorageKey)
    reservations.push(reservation)
    try {
      window.localStorage.setItem(reservationStorageKey, JSON.stringify(reservations))
    } catch {
      // La confirmación en pantalla sigue disponible si el almacenamiento está bloqueado.
    }
    setFeedback({ type: 'success', reservation })
    setForm(initialBooking)
  }

  return (
    <section className="booking-section" id="reservas">
      <div className="section booking-inner">
        <div className="section-heading">
          <div><p className="eyebrow">RESERVAS</p><h2>Reserva tu experiencia</h2><p>Completa tus datos para solicitar una visita o experiencia turística.</p></div>
        </div>
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field"><label htmlFor="bookingPlace">Destino</label><select ref={(node) => { fieldRefs.current.place = node }} id="bookingPlace" value={form.place} onChange={(event) => updateField('place', event.target.value)} required><option value="">Selecciona un destino</option>{places.map((place) => <option key={place.name} value={place.name}>{place.name}</option>)}</select></div>
            <div className="field"><label htmlFor="bookingDate">Fecha</label><input ref={(node) => { fieldRefs.current.date = node }} id="bookingDate" type="date" min={today} value={form.date} onChange={(event) => updateField('date', event.target.value)} required /></div>
            <div className="field"><label htmlFor="bookingTime">Horario</label><select ref={(node) => { fieldRefs.current.time = node }} id="bookingTime" value={form.time} onChange={(event) => updateField('time', event.target.value)} required><option value="">Selecciona un horario</option>{['09:00', '11:00', '14:00', '16:00'].map((time) => <option key={time}>{time}</option>)}</select></div>
            <div className="field"><label htmlFor="bookingPeople">Personas</label><input ref={(node) => { fieldRefs.current.people = node }} id="bookingPeople" type="number" min="1" max="15" value={form.people} onChange={(event) => updateField('people', event.target.value === '' ? '' : String(Math.max(1, Math.min(15, Number(event.target.value)))))} required /></div>
            <div className="field"><label htmlFor="bookingName">Nombre completo</label><input ref={(node) => { fieldRefs.current.name = node }} id="bookingName" type="text" placeholder="Tu nombre" value={form.name} onChange={(event) => updateField('name', event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, ''))} required /></div>
            <div className="field"><label htmlFor="bookingEmail">Correo electrónico</label><input ref={(node) => { fieldRefs.current.email = node }} id="bookingEmail" type="email" placeholder="nombre@correo.com" value={form.email} onChange={(event) => updateField('email', event.target.value)} required /></div>
            <div className="field full"><label htmlFor="bookingPhone">Teléfono</label><input ref={(node) => { fieldRefs.current.phone = node }} id="bookingPhone" type="tel" placeholder="Ej. 76543210" inputMode="numeric" minLength="8" maxLength="8" pattern="[0-9]{8}" autoComplete="tel" value={form.phone.replace(/\D/g, '').slice(0, 8)} onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 8))} required /><small className="form-error" aria-live="polite">{form.phone.length > 0 && form.phone.length < 8 ? 'El teléfono debe tener exactamente 8 dígitos.' : ''}</small></div>
          </div>
          <div className="booking-summary"><div><strong>Solicitud de reserva</strong><p>Recibirás una confirmación con los detalles de tu solicitud.</p></div><button className="btn primary" type="submit">Confirmar reserva</button></div>
          {feedback?.type === 'error' && <p className="booking-message form-feedback error-feedback" role="alert">{feedback.text}</p>}
          {feedback?.type === 'success' && <div className="booking-message" role="status"><div className="reservation-success"><h3>Reserva registrada correctamente</h3><p>Gracias, <strong>{feedback.reservation.name}</strong>. Tu solicitud ha sido registrada.</p><p><strong>Destino:</strong> {feedback.reservation.place}</p><p><strong>Fecha:</strong> {feedback.reservation.date}</p><p><strong>Horario:</strong> {feedback.reservation.time}</p><p><strong>Personas:</strong> {feedback.reservation.people}</p><p><strong>Código de reserva:</strong> {feedback.reservation.code}</p><small>Guarda este código para consultar tu solicitud posteriormente.</small></div></div>}
        </form>
      </div>
    </section>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [route, setRoute] = useState(() => readStoredArray(routeStorageKey).filter((name) => places.some((place) => place.name === name)))
  const [notice, setNotice] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const plannerRef = useRef(null)
  const searchRef = useRef(null)
  const closeModal = useCallback(() => setSelectedPlace(null), [])

  useEffect(() => {
    try {
      window.localStorage.setItem(routeStorageKey, JSON.stringify(route))
    } catch {
      // El recorrido permanece disponible en memoria durante esta sesión.
    }
  }, [route])

  const filteredPlaces = useMemo(() => {
    const term = search.trim().toLowerCase()
    return places.filter((place) => {
      const matchesCategory = activeCategory === 'Todos' || place.category === activeCategory
      const searchableText = `${place.name} ${place.category} ${place.location} ${place.description}`.toLowerCase()
      return matchesCategory && (!term || searchableText.includes(term))
    })
  }, [activeCategory, search])

  function addToRoute(name) {
    if (route.includes(name)) {
      setNotice('Ese destino ya está en tu recorrido.')
      return
    }
    setRoute((current) => current.includes(name) ? current : [...current, name])
    setNotice(`${name} fue agregado a tu recorrido.`)
  }

  function removeFromRoute(name) {
    setRoute((current) => current.filter((place) => place !== name))
  }

  function addRecommendedRoute(routeName) {
    const selectedRoute = recommendedRoutes[routeName]
    if (!selectedRoute) return
    selectedRoute.forEach(addToRoute)
    plannerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resultMessage = notice || (search.trim() ? `${filteredPlaces.length} destino(s) encontrado(s).` : '')

  return (
    <>
      <header className="hero" id="inicio">
        <nav className="nav" aria-label="Navegación principal">
          <a className="logo" href="#inicio" onClick={() => setMenuOpen(false)}>Descubre<span>Cochabamba</span></a>
          <div className={`nav-links${menuOpen ? ' show' : ''}`}>
            <a href="#lugares" onClick={() => setMenuOpen(false)}>Lugares</a><a href="#categorias" onClick={() => setMenuOpen(false)}>Categorías</a><a href="#planifica" onClick={() => setMenuOpen(false)}>Planifica</a><a href="#reservas" onClick={() => setMenuOpen(false)}>Reservas</a>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} type="button">☰</button>
        </nav>
        <div className="hero-content"><p className="eyebrow">GUÍA TURÍSTICA</p><h1>Descubre la magia de Cochabamba</h1><p>Conoce lugares increíbles, organiza tu recorrido y reserva experiencias para disfrutar la Llajta a tu manera.</p><a className="btn primary" href="#lugares">Explorar lugares</a></div>
      </header>

      <main>
        <section className="search-section" aria-label="Buscar destinos"><div className="search-box"><label htmlFor="search">¿Qué lugar quieres conocer?</label><div className="search-row"><input ref={searchRef} id="search" type="search" placeholder="Ej. Cristo de la Concordia..." autoComplete="off" value={search} onChange={(event) => { setSearch(event.target.value); setNotice('') }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); setNotice('') } }} /><button className="btn primary" type="button" onClick={() => { setNotice(''); searchRef.current?.focus() }}>Buscar</button></div><p className="search-message" aria-live="polite">{resultMessage}</p></div></section>

        <section className="section" id="categorias"><div className="section-heading"><div><p className="eyebrow">ELIGE TU EXPERIENCIA</p><h2>Explora por categoría</h2><p>Encuentra destinos según el tipo de experiencia que buscas.</p></div></div><div className="categories" aria-label="Filtrar por categoría">{categories.map((category) => <button key={category} className={`category${activeCategory === category ? ' active' : ''}`} aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); setNotice('') }} type="button">{category}</button>)}</div></section>

        <section className="section" id="lugares"><div className="section-heading"><div><p className="eyebrow">PARA EMPEZAR</p><h2>Lugares destacados</h2><p>Explora destinos, consulta sus datos y agrégalos a tu recorrido.</p></div></div><div className="cards">{filteredPlaces.map((place) => <PlaceCard key={place.name} place={place} onInfo={setSelectedPlace} onAdd={addToRoute} />)}</div>{filteredPlaces.length === 0 && <p className="no-results">No encontramos ese lugar. Prueba con otro nombre o categoría.</p>}</section>

        <section className="recommend-section section"><div className="section-heading"><div><p className="eyebrow">IDEAS PARA TU VISITA</p><h2>Experiencias recomendadas</h2></div></div><div className="recommend-grid"><article><span>01</span><h3>Un día cultural</h3><p>Centro histórico, Plaza 14 de Septiembre y Palacio Portales.</p><button className="text-btn" onClick={() => addRecommendedRoute('cultural')} type="button">Agregar recorrido</button></article><article><span>02</span><h3>Naturaleza y paisaje</h3><p>Laguna Angostura y una experiencia en el entorno del Tunari.</p><button className="text-btn" onClick={() => addRecommendedRoute('naturaleza')} type="button">Agregar recorrido</button></article><article><span>03</span><h3>Ruta de aventura</h3><p>Destinos para caminar, explorar y disfrutar del paisaje.</p><button className="text-btn" onClick={() => addRecommendedRoute('aventura')} type="button">Agregar recorrido</button></article></div></section>

        <section ref={plannerRef} className="planner section" id="planifica"><div className="planner-copy"><p className="eyebrow">TU PRÓXIMA AVENTURA</p><h2>Planifica tu recorrido</h2><p>Selecciona tus destinos favoritos y arma una ruta personalizada. Puedes quitar lugares o cambiar de idea cuando quieras.</p></div><div className="route-box"><div className="route-header"><h3>Mi recorrido</h3><span>{route.length} {route.length === 1 ? 'lugar' : 'lugares'}</span></div><div className="route-list" aria-live="polite">{route.length === 0 ? <p className="empty-route">Todavía no agregaste lugares.</p> : route.map((name, index) => <div className="route-item" key={name}><span><b>{index + 1}</b>{name}</span><button onClick={() => removeFromRoute(name)} aria-label={`Quitar ${name}`} type="button">×</button></div>)}</div><div className="route-actions"><button className="btn secondary" onClick={() => setRoute([])} type="button">Limpiar</button><a className="btn primary" href="#reservas">Reservar experiencia</a></div></div></section>

        <BookingSection />
      </main>

      <footer><div><strong>Descubre Cochabamba</strong><p>Una guía digital para conocer, planificar y disfrutar la Llajta.</p></div><div className="footer-links"><a href="#inicio">Inicio</a><a href="#lugares">Lugares</a><a href="#categorias">Categorías</a><a href="#planifica">Planifica</a><a href="#reservas">Reservas</a></div><p>© 2026 · Proyecto académico</p></footer>
      <DestinationModal place={selectedPlace} isAdded={selectedPlace ? route.includes(selectedPlace.name) : false} onClose={closeModal} onAdd={addToRoute} />
    </>
  )
}

export default App
