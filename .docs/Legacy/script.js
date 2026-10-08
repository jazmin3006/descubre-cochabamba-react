/* =========================================================
   DESCUBRE COCHABAMBA - JAVASCRIPT
   Imágenes: cambia solamente el valor de "image" de cada lugar.
   Ejemplo: image: "img/cristo.jpg"
   También puedes usar un enlace directo: image: "https://..."
========================================================= */

const places = [
    {
        name: "Cristo de la Concordia",
        category: "Cultura",
        location: "San Pedro, Cochabamba",
        time: "1–2 horas",
        price: "Consultar tarifa de acceso",
        rating: "4.8",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOwRCcJhT41ZbIgAllbev247FBrHc7vh7vaBlD6rOsmg&s=10",
        description: "Uno de los símbolos más reconocidos de Cochabamba. Su mirador permite disfrutar una vista panorámica de la ciudad y sus alrededores."
    },
    {
        name: "Laguna Angostura",
        category: "Naturaleza",
        location: "Valle Alto, Cochabamba",
        time: "2–4 horas",
        price: "Acceso variable según actividad",
        rating: "4.5",
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/00/03/93/cam01225-largejpg.jpg?w=1200&h=-1&s=1",
        description: "Destino ideal para descansar y disfrutar del paisaje. Sus alrededores permiten realizar actividades recreativas y pasar una jornada al aire libre."
    },
    {
        name: "Palacio Portales",
        category: "Historia",
        location: "Queru Queru, Cochabamba",
        time: "1–2 horas",
        price: "Consultar tarifa de visita",
        rating: "4.7",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoEfQmuvgnxX4LzWQCqqGa-9xbT1VPB6s1mN3lmrhbwQ&s=10",
        description: "Edificio patrimonial reconocido por su arquitectura, jardines y valor cultural. Una visita recomendada para conocer parte de la historia de la ciudad."
    },
    {
        name: "Parque Nacional Tunari",
        category: "Aventura",
        location: "Cordillera del Tunari",
        time: "3–6 horas",
        price: "Según ruta y actividad",
        rating: "4.7",
        image: "https://www.laregion.bo/wp-content/uploads/2022/08/tunari.jpg",
        description: "Área natural con montañas y paisajes para caminatas, contemplación y aventura. La duración depende del recorrido elegido."
    },
    {
        name: "Plaza 14 de Septiembre",
        category: "Cultura",
        location: "Centro histórico",
        time: "1 hora",
        price: "Gratuito",
        rating: "4.6",
        image: "https://thumbs.dreamstime.com/b/de-septiembre-y-catedral-metropolitana-cochabamba-bolivia-foto-alta-calidad-238478276.jpg",
        description: "Corazón del centro histórico de Cochabamba, rodeado de arquitectura representativa, espacios públicos y puntos de interés urbano."
    },
    {
        name: "Convento de Santa Teresa",
        category: "Historia",
        location: "Centro de Cochabamba",
        time: "1–2 horas",
        price: "Consultar tarifa de visita",
        rating: "4.6",
        image: "https://www.laregion.bo/wp-content/uploads/2015/10/Santa_Teresa.jpg",
        description: "Patrimonio histórico y arquitectónico del centro de Cochabamba. Su recorrido permite conocer parte de la historia y arquitectura colonial."
    }
];

const cardsEl = document.querySelector("#cards");
const search = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
const message = document.querySelector("#searchMessage");
const noResults = document.querySelector("#noResults");
const categories = [...document.querySelectorAll(".category")];

let activeCategory = "Todos";
let route = JSON.parse(localStorage.getItem("cochaRoute") || "[]");
let selectedModalPlace = null;

/* =========================================================
   TARJETAS Y BUSCADOR
========================================================= */

function renderCards() {
    const term = search.value.trim().toLowerCase();

    const filtered = places.filter(place => {
        const matchesCategory = activeCategory === "Todos" || place.category === activeCategory;
        const text = `${place.name} ${place.category} ${place.location} ${place.description}`.toLowerCase();
        return matchesCategory && (!term || text.includes(term));
    });

    cardsEl.innerHTML = filtered.map(place => `
        <article class="card">
            <div class="card-image">
                <img
                    src="${place.image}"
                    alt="Fotografía de ${place.name}"
                    loading="lazy"
                    onerror="imageFallback(this)"
                >
                <span class="image-label">${place.category.toUpperCase()}</span>
            </div>

            <div class="card-body">
                <div class="card-top">
                    <span class="mini-category">${place.category}</span>
                    <span class="rating">★ ${place.rating}</span>
                </div>

                <h3>${place.name}</h3>
                <p class="card-description">${place.description}</p>
                <p class="location">${place.location}</p>

                <div class="card-meta">
                    <span>${place.time}</span>
                    <span>${place.price}</span>
                </div>

                <div class="card-actions">
                    <button class="info-btn" data-place="${place.name}" type="button">
                        Ver información
                    </button>
                    <button class="add-btn" data-add="${place.name}" type="button">
                        + Recorrido
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    noResults.classList.toggle("hidden", filtered.length !== 0);
    message.textContent = search.value.trim() ? `${filtered.length} destino(s) encontrado(s).` : "";

    document.querySelectorAll(".info-btn").forEach(button => {
        button.addEventListener("click", () => openModal(button.dataset.place));
    });

    document.querySelectorAll(".add-btn").forEach(button => {
        button.addEventListener("click", () => addToRoute(button.dataset.add));
    });
}

function imageFallback(img) {
    img.style.display = "none";
    img.parentElement.classList.add("image-error");
}

/* =========================================================
   FILTROS
========================================================= */

categories.forEach(button => {
    button.addEventListener("click", () => {
        categories.forEach(category => category.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.category;
        renderCards();
    });
});

search.addEventListener("input", renderCards);
searchBtn.addEventListener("click", renderCards);
search.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        renderCards();
    }
});

/* =========================================================
   RECORRIDO PERSONALIZADO
========================================================= */

function addToRoute(name) {
    if (!route.includes(name)) {
        route.push(name);
        saveRoute();
        renderRoute();
        message.textContent = `${name} fue agregado a tu recorrido.`;
    } else {
        message.textContent = "Ese destino ya está en tu recorrido.";
    }
}

function removeFromRoute(name) {
    route = route.filter(place => place !== name);
    saveRoute();
    renderRoute();
}

function saveRoute() {
    localStorage.setItem("cochaRoute", JSON.stringify(route));
}

function renderRoute() {
    const list = document.querySelector("#routeList");
    const count = document.querySelector("#routeCount");

    count.textContent = `${route.length} ${route.length === 1 ? "lugar" : "lugares"}`;

    if (route.length === 0) {
        list.innerHTML = `<p class="empty-route">Todavía no agregaste lugares.</p>`;
        return;
    }

    list.innerHTML = route.map((name, index) => `
        <div class="route-item">
            <span><b>${index + 1}</b>${name}</span>
            <button data-remove="${name}" aria-label="Quitar ${name}" type="button">×</button>
        </div>
    `).join("");

    document.querySelectorAll("[data-remove]").forEach(button => {
        button.addEventListener("click", () => removeFromRoute(button.dataset.remove));
    });
}

document.querySelector("#clearRoute").addEventListener("click", () => {
    route = [];
    saveRoute();
    renderRoute();
});

/* =========================================================
   MODAL DE INFORMACIÓN
========================================================= */

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalDetails = document.querySelector("#modalDetails");
const modalImage = document.querySelector("#modalImage");
const modalAddBtn = document.querySelector("#modalAddBtn");
const closeModalBtn = document.querySelector("#closeModal");
const modalCloseBtn = document.querySelector("#modalCloseBtn");

function openModal(name) {
    const place = places.find(item => item.name === name);
    if (!place) return;

    selectedModalPlace = place;

    modalTitle.textContent = place.name;
    modalDescription.textContent = place.description;

    modalImage.innerHTML = `
        <img
            src="${place.image}"
            alt="Fotografía de ${place.name}"
            onerror="imageFallback(this)"
        >
    `;

    modalDetails.innerHTML = `
        <div><strong>Categoría</strong><span>${place.category}</span></div>
        <div><strong>Ubicación</strong><span>${place.location}</span></div>
        <div><strong>Tiempo recomendado</strong><span>${place.time}</span></div>
        <div><strong>Costo</strong><span>${place.price}</span></div>
        <div><strong>Valoración</strong><span>★ ${place.rating}</span></div>
    `;

    modalAddBtn.textContent = route.includes(name)
        ? "Ya está en tu recorrido"
        : "Agregar al recorrido";

    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    selectedModalPlace = null;
}

closeModalBtn.addEventListener("click", closeModal);
modalCloseBtn.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

modalAddBtn.addEventListener("click", () => {
    if (!selectedModalPlace) return;
    addToRoute(selectedModalPlace.name);
    modalAddBtn.textContent = "Ya está en tu recorrido";
});

/* =========================================================
   RECORRIDOS RECOMENDADOS
========================================================= */

const recommendedRoutes = {
    cultural: [
        "Plaza 14 de Septiembre",
        "Palacio Portales",
        "Convento de Santa Teresa"
    ],
    naturaleza: [
        "Laguna Angostura",
        "Parque Nacional Tunari"
    ],
    aventura: [
        "Parque Nacional Tunari",
        "Laguna Angostura"
    ]
};

document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
        const selectedRoute = recommendedRoutes[button.dataset.route];
        if (!selectedRoute) return;

        selectedRoute.forEach(addToRoute);
        document.querySelector("#planifica").scrollIntoView({ behavior: "smooth" });
    });
});

/* =========================================================
   RESERVAS
========================================================= */

const bookingForm = document.querySelector("#bookingForm");
const bookingPlace = document.querySelector("#bookingPlace");
const bookingDate = document.querySelector("#bookingDate");
const bookingTime = document.querySelector("#bookingTime");
const bookingPeople = document.querySelector("#bookingPeople");
const bookingName = document.querySelector("#bookingName");
const bookingEmail = document.querySelector("#bookingEmail");
const bookingPhone = document.querySelector("#bookingPhone");
const phoneError = document.querySelector("#phoneError");
const bookingMessage = document.querySelector("#bookingMessage");

places.forEach(place => {
    bookingPlace.add(new Option(place.name, place.name));
});

function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

bookingDate.min = getToday();

/* Teléfono: únicamente números y exactamente 8 dígitos */
bookingPhone.addEventListener("input", () => {
    bookingPhone.value = bookingPhone.value.replace(/\D/g, "").slice(0, 8);

    if (bookingPhone.value.length > 0 && bookingPhone.value.length < 8) {
        phoneError.textContent = "El teléfono debe tener exactamente 8 dígitos.";
        bookingPhone.setCustomValidity("El teléfono debe tener exactamente 8 dígitos.");
    } else {
        phoneError.textContent = "";
        bookingPhone.setCustomValidity("");
    }
});

/* Nombre: letras y espacios */
bookingName.addEventListener("input", () => {
    bookingName.value = bookingName.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
});

/* Personas: limitar a 1–15 */
bookingPeople.addEventListener("input", () => {
    if (bookingPeople.value !== "") {
        bookingPeople.value = Math.max(1, Math.min(15, Number(bookingPeople.value)));
    }
});

bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = bookingName.value.trim();
    const place = bookingPlace.value;
    const date = bookingDate.value;
    const time = bookingTime.value;
    const people = Number(bookingPeople.value);
    const email = bookingEmail.value.trim();
    const phone = bookingPhone.value.trim();

    if (!place) {
        alert("Selecciona un destino turístico.");
        bookingPlace.focus();
        return;
    }

    if (!date || date < getToday()) {
        alert("Selecciona una fecha válida. No puedes reservar una fecha anterior a hoy.");
        bookingDate.focus();
        return;
    }

    if (!time) {
        alert("Selecciona un horario.");
        bookingTime.focus();
        return;
    }

    if (!Number.isInteger(people) || people < 1 || people > 15) {
        alert("La cantidad de personas debe estar entre 1 y 15.");
        bookingPeople.focus();
        return;
    }

    if (name.length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name)) {
        alert("Ingresa un nombre válido.");
        bookingName.focus();
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Ingresa un correo electrónico válido.");
        bookingEmail.focus();
        return;
    }

    if (!/^\d{8}$/.test(phone)) {
        phoneError.textContent = "El teléfono debe tener exactamente 8 dígitos.";
        bookingPhone.setCustomValidity("El teléfono debe tener exactamente 8 dígitos.");
        alert("El número de teléfono debe tener exactamente 8 dígitos.");
        bookingPhone.focus();
        return;
    }

    const code = "COCHA-" + Math.random().toString(36).slice(2, 7).toUpperCase();

    const reservation = {
        code,
        name,
        place,
        date,
        time,
        people,
        email,
        phone,
        createdAt: new Date().toISOString()
    };

    const reservations = JSON.parse(localStorage.getItem("cochaReservations") || "[]");
    reservations.push(reservation);
    localStorage.setItem("cochaReservations", JSON.stringify(reservations));

    bookingMessage.innerHTML = `
        <div class="reservation-success">
            <h3>Reserva registrada correctamente</h3>
            <p>Gracias, <strong>${name}</strong>. Tu solicitud ha sido registrada.</p>
            <p><strong>Destino:</strong> ${place}</p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Horario:</strong> ${time}</p>
            <p><strong>Personas:</strong> ${people}</p>
            <p><strong>Código de reserva:</strong> ${code}</p>
            <small>Guarda este código para consultar tu solicitud posteriormente.</small>
        </div>
    `;

    bookingForm.reset();
    bookingDate.min = getToday();
});

/* =========================================================
   MENÚ RESPONSIVE
========================================================= */

const menuBtn = document.querySelector("#menuBtn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("show"));
});

/* =========================================================
   INICIAR
========================================================= */

renderCards();
renderRoute();
