import { useRef, useState } from 'react'
import { getToday, places, readStoredArray, reservationStorageKey } from '../data/places.js'

const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/

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

    try {
      const reservations = readStoredArray(reservationStorageKey)
      reservations.push(reservation)
      window.localStorage.setItem(reservationStorageKey, JSON.stringify(reservations))
    } catch (error) {
      console.error('No se pudo guardar la reserva.', error)
      setFeedback({ type: 'error', text: 'No pudimos guardar tu reserva. Revisa el almacenamiento del navegador e inténtalo nuevamente.' })
      return
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
            <div className="field full"><label htmlFor="bookingPhone">Teléfono</label><input ref={(node) => { fieldRefs.current.phone = node }} id="bookingPhone" type="tel" placeholder="Ej. 76543210" inputMode="numeric" minLength="8" pattern="[0-9]{8}" autoComplete="tel" value={form.phone.replace(/\D/g, '').slice(0, 8)} onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 8))} required /><small className="form-error" aria-live="polite">{form.phone.length > 0 && form.phone.length < 8 ? 'El teléfono debe tener exactamente 8 dígitos.' : ''}</small></div>
          </div>
          <div className="booking-summary"><div><strong>Solicitud de reserva</strong><p>Recibirás una confirmación con los detalles de tu solicitud.</p></div><button className="btn primary" type="submit">Confirmar reserva</button></div>
          {feedback?.type === 'error' && <p className="booking-message form-feedback error-feedback" role="alert">{feedback.text}</p>}
          {feedback?.type === 'success' && <div className="booking-message" role="status"><div className="reservation-success"><h3>Reserva registrada correctamente</h3><p>Gracias, <strong>{feedback.reservation.name}</strong>. Tu solicitud ha sido registrada.</p><p><strong>Destino:</strong> {feedback.reservation.place}</p><p><strong>Fecha:</strong> {feedback.reservation.date}</p><p><strong>Horario:</strong> {feedback.reservation.time}</p><p><strong>Personas:</strong> {feedback.reservation.people}</p><p><strong>Código de reserva:</strong> {feedback.reservation.code}</p><small>Guarda este código para consultar tu solicitud posteriormente.</small></div></div>}
        </form>
      </div>
    </section>
  )
}

export default BookingSection
