import PlaceImage from './PlaceImage.jsx'

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

export default PlaceCard
