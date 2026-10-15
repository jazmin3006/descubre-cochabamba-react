import { useEffect, useRef } from 'react'
import PlaceImage from './PlaceImage.jsx'

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

export default DestinationModal
