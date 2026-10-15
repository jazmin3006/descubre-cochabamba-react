import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="section not-found">
      <p className="eyebrow">PÁGINA NO ENCONTRADA</p>
      <h2>Este destino no está disponible</h2>
      <p>La dirección puede ser incorrecta o la página ya no existe.</p>
      <Link className="btn primary" to="/">Volver al inicio</Link>
    </section>
  )
}

export default NotFoundPage
