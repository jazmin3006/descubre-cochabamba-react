import { useState } from 'react'

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

export default PlaceImage
