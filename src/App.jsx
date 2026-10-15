import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import BookingSection from './components/BookingSection.jsx'
import DestinationModal from './components/DestinationModal.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import PlaceCard from './components/PlaceCard.jsx'
import {
  categories,
  places,
  readStoredArray,
  recommendedRoutes,
  reservationStorageKey,
  routeStorageKey,
} from './data/places.js'

function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [initialRoute] = useState(() => {
    try {
      return {
        places: readStoredArray(routeStorageKey).filter((name) => places.some((place) => place.name === name)),
        error: '',
      }
    } catch (error) {
      console.error('No se pudo cargar el recorrido guardado.', error)
      return { places: [], error: 'No se pudo cargar el recorrido guardado.' }
    }
  })
  const [route, setRoute] = useState(initialRoute.places)
  const [routeHasChanged, setRouteHasChanged] = useState(false)
  const [notice, setNotice] = useState(initialRoute.error)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const plannerRef = useRef(null)
  const searchRef = useRef(null)
  const closeModal = useCallback(() => setSelectedPlace(null), [])

  useEffect(() => {
    setMenuOpen(false)
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash, location.key])

  useEffect(() => {
    if (!routeHasChanged) return

    try {
      window.localStorage.setItem(routeStorageKey, JSON.stringify(route))
    } catch (error) {
      console.error('No se pudo guardar el recorrido.', error)
      setNotice('No se pudo guardar el recorrido. Revisa el almacenamiento del navegador.')
    }
  }, [route, routeHasChanged])

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
    setRouteHasChanged(true)
    setNotice(`${name} fue agregado a tu recorrido.`)
  }

  function removeFromRoute(name) {
    setRoute((current) => current.filter((place) => place !== name))
    setRouteHasChanged(true)
  }

  function clearRoute() {
    setRoute([])
    setRouteHasChanged(true)
  }

  function addRecommendedRoute(routeName) {
    const selectedRoute = recommendedRoutes[routeName]
    if (!selectedRoute) return
    selectedRoute.forEach(addToRoute)
    plannerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resultMessage = notice || (search.trim() ? `${filteredPlaces.length} destino(s) encontrado(s).` : '')
  const searchSection = (
    <section className="search-section" aria-label="Buscar destinos">
      <div className="search-box">
        <label htmlFor="search">¿Qué lugar quieres conocer?</label>
        <div className="search-row">
          <input
            ref={searchRef}
            id="search"
            type="search"
            placeholder="Ej. Cristo de la Concordia..."
            autoComplete="off"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setNotice('') }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                setNotice('')
              }
            }}
          />
          <button className="btn primary" type="button" onClick={() => { setNotice(''); searchRef.current?.focus() }}>Buscar</button>
        </div>
        <p className="search-message" aria-live="polite">{resultMessage}</p>
      </div>
    </section>
  )
  const categoriesSection = (
    <section className="section" id="categorias">
      <div className="section-heading">
        <div><p className="eyebrow">ELIGE TU EXPERIENCIA</p><h2>Explora por categoría</h2><p>Encuentra destinos según el tipo de experiencia que buscas.</p></div>
      </div>
      <div className="categories" aria-label="Filtrar por categoría">
        {categories.map((category) => (
          <button
            key={category}
            className={`category${activeCategory === category ? ' active' : ''}`}
            aria-pressed={activeCategory === category}
            onClick={() => { setActiveCategory(category); setNotice('') }}
            type="button"
          >{category}</button>
        ))}
      </div>
    </section>
  )
  const placesSection = (
    <section className="section" id="lugares">
      <div className="section-heading">
        <div><p className="eyebrow">PARA EMPEZAR</p><h2>Lugares destacados</h2><p>Explora destinos, consulta sus datos y agrégalos a tu recorrido.</p></div>
      </div>
      {searchSection}
      <div className="cards">
        {filteredPlaces.map((place) => (
          <PlaceCard key={place.name} place={place} onInfo={setSelectedPlace} onAdd={addToRoute} />
        ))}
      </div>
      {filteredPlaces.length === 0 && <p className="no-results">No encontramos ese lugar. Prueba con otro nombre o categoría.</p>}
    </section>
  )
  const recommendationsSection = (
    <section className="recommend-section section" id="recomendaciones">
      <div className="section-heading"><div><p className="eyebrow">IDEAS PARA TU VISITA</p><h2>Experiencias recomendadas</h2></div></div>
      <div className="recommend-grid">
        <article><span>01</span><h3>Un día cultural</h3><p>Centro histórico, Plaza 14 de Septiembre y Palacio Portales.</p><button className="text-btn" onClick={() => addRecommendedRoute('cultural')} type="button">Agregar recorrido</button></article>
        <article><span>02</span><h3>Naturaleza y paisaje</h3><p>Laguna Angostura y una experiencia en el entorno del Tunari.</p><button className="text-btn" onClick={() => addRecommendedRoute('naturaleza')} type="button">Agregar recorrido</button></article>
        <article><span>03</span><h3>Ruta de aventura</h3><p>Destinos para caminar, explorar y disfrutar del paisaje.</p><button className="text-btn" onClick={() => addRecommendedRoute('aventura')} type="button">Agregar recorrido</button></article>
      </div>
    </section>
  )
  const plannerSection = (
    <section ref={plannerRef} className="planner section" id="planifica">
      <div className="planner-copy"><p className="eyebrow">TU PRÓXIMA AVENTURA</p><h2>Planifica tu recorrido</h2><p>Selecciona tus destinos favoritos y arma una ruta personalizada. Puedes quitar lugares o cambiar de idea cuando quieras.</p></div>
      <div className="route-box">
        <div className="route-header"><h3>Mi recorrido</h3><span>{route.length} {route.length === 1 ? 'lugar' : 'lugares'}</span></div>
        <div className="route-list" aria-live="polite">
          {route.length === 0 ? <p className="empty-route">Todavía no agregaste lugares.</p> : route.map((name, index) => <div className="route-item" key={name}><span><b>{index + 1}</b>{name}</span><button onClick={() => removeFromRoute(name)} aria-label={`Quitar ${name}`} type="button">×</button></div>)}
        </div>
        <div className="route-actions"><button className="btn secondary" onClick={clearRoute} type="button">Limpiar</button><Link className="btn primary" to="/reservas">Reservar experiencia</Link></div>
      </div>
    </section>
  )

  return (
    <>
      <header className={isHomePage ? 'hero' : 'site-header'} id="inicio">
        <nav className="nav" aria-label="Navegación principal">
          <Link className="logo" to="/#inicio">Descubre<span>Cochabamba</span></Link>
          <div className={`nav-links${menuOpen ? ' show' : ''}`}>
            <Link to="/#lugares" onClick={() => setMenuOpen(false)}>Lugares</Link><Link to="/#categorias" onClick={() => setMenuOpen(false)}>Categorías</Link><Link to="/#planifica" onClick={() => setMenuOpen(false)}>Planifica</Link><Link to="/#reservas" onClick={() => setMenuOpen(false)}>Reservas</Link>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} type="button">☰</button>
        </nav>
        {isHomePage && (
          <div className="hero-content">
            <p className="eyebrow">BIENVENIDO A COCHABAMBA</p>
            <h1>Descubre la magia de Cochabamba</h1>
            <p>Conoce lugares increíbles, organiza tu recorrido y reserva experiencias para disfrutar la Llajta a tu manera.</p>
            <Link className="btn primary" to="/#lugares">Explorar lugares</Link>
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<>{categoriesSection}{placesSection}{recommendationsSection}{plannerSection}<BookingSection /></>} />
          <Route path="/lugares" element={<>{categoriesSection}{placesSection}</>} />
          <Route path="/categorias" element={<>{categoriesSection}{placesSection}</>} />
          <Route path="/planifica" element={<>{plannerSection}{recommendationsSection}</>} />
          <Route path="/reservas" element={<BookingSection />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer><div><strong>Descubre Cochabamba</strong><p>Una guía digital para conocer, planificar y disfrutar la Llajta.</p></div><div className="footer-links"><Link to="/#inicio">Inicio</Link><Link to="/#lugares">Lugares</Link><Link to="/#categorias">Categorías</Link><Link to="/#planifica">Planifica</Link><Link to="/#reservas">Reservas</Link></div><p>© 2026 · Proyecto académico</p></footer>
      <DestinationModal place={selectedPlace} isAdded={selectedPlace ? route.includes(selectedPlace.name) : false} onClose={closeModal} onAdd={addToRoute} />
    </>
  )
}

export default App
