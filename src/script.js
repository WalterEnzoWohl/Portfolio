let menuVisible = false;

// Mostrar/ocultar menú
function mostrarOcultarMenu() {
  if (menuVisible) {
    document.getElementById("nav").classList = "";
    menuVisible = false;
  } else {
    document.getElementById("nav").classList = "responsive";
    menuVisible = true;
  }
}
function seleccionar() {
  document.getElementById("nav").classList = "";
  menuVisible = false;
}
function efectoHabilidades() {
  var skills = document.getElementById("skills");
  var distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;
  if (distancia_skills >= 300) {
    let habilidades = document.getElementsByClassName("progreso");
    habilidades[0].classList.add("javascript");
    habilidades[1].classList.add("htmlcss");
    habilidades[2].classList.add("excel");
    habilidades[3].classList.add("sql");
    habilidades[4].classList.add("powerbi");
    habilidades[5].classList.add("python");
    habilidades[6].classList.add("trabajoenequipo");
    habilidades[7].classList.add("comunicacion");
    habilidades[8].classList.add("organizacion");
    habilidades[9].classList.add("tiempo");
    habilidades[10].classList.add("frustracion");
    habilidades[11].classList.add("metodologias");
  } else {
    reinicioHabilidades();
  }
}
function reinicioHabilidades() {
  let habilidades = document.getElementsByClassName("progreso");
  for (let i = 0; i < habilidades.length; i++) {
    habilidades[i].classList.remove(
      "javascript",
      "htmlcss",
      "excel",
      "sql",
      "powerbi",
      "python",
      "trabajoenequipo",
      "comunicacion",
      "organizacion",
      "tiempo",
      "frustracion",
      "metodologias"
    );
  }
}
window.onscroll = function () {
  efectoHabilidades();
};

const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_bixc80n';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});
//CURRICULUM
// Carga del JSON
fetch('/data/cv.json')
  .then(response => response.json())
  .then(data => {
    renderCurriculum(data.formacion, data.experiencia);
  })
  .catch(err => console.error("Error cargando JSON:", err));

// Crea el HTML de un ítem de curriculum
function crearItem({ titulo, institucion, empresa, fecha, descripcion }, lado = "izq") {
  const div = document.createElement("div");
  div.classList.add("item", lado === "izq" ? "izq" : "der");

  // casa = institucion (izq) o empresa (der)
  const casa = institucion || empresa || "";

  // ID único para accesibilidad del acordeón
  const uid = `${lado}-${titulo.replace(/\s+/g, "-").toLowerCase()}`;

  div.innerHTML = `
    <h4>${titulo}</h4>
    <span class="casa">${casa}</span>
    <span class="fecha">${fecha}</span>

    <button class="toggle-btn" aria-expanded="false" aria-controls="desc-${uid}">
      Ver más
      <i class="fa-solid fa-chevron-down chevron" aria-hidden="true"></i>
    </button>

    <div id="desc-${uid}" class="descripcion-wrapper" role="region" aria-labelledby="btn-${uid}">
      <p class="descripcion">${descripcion}</p>
    </div>

    ${
      lado === "izq"
        ? `<div class="conectori"><div class="circuloi"></div></div>`
        : `<div class="conectord"><div class="circulod"></div></div>`
    }
  `;

  // toggle
  const btn = div.querySelector(".toggle-btn");
  const panel = div.querySelector(".descripcion-wrapper");
  btn.id = `btn-${uid}`;
  btn.addEventListener("click", () => togglePanel(btn, panel));

  return div;
}

// Alterna el panel con animación de altura
function togglePanel(btn, panel) {
  const abierto = btn.getAttribute("aria-expanded") === "true";
  const columna = btn.closest(".col"); // limita a la misma columna

  // cerrar otros abiertos
  columna.querySelectorAll(".toggle-btn[aria-expanded='true']").forEach(b => {
    if (b !== btn) {
      const p = b.parentElement.querySelector(".descripcion-wrapper");
      p.style.maxHeight = "0px";
      b.setAttribute("aria-expanded", "false");
      b.querySelector(".chevron")?.classList.remove("rotated");
      b.firstChild.nodeValue = "Ver más ";
    }
  });

  // toggle actual
  if (abierto) {
    panel.style.maxHeight = panel.scrollHeight + "px";
    requestAnimationFrame(() => { panel.style.maxHeight = "0px"; });
    btn.setAttribute("aria-expanded", "false");
    btn.querySelector(".chevron")?.classList.remove("rotated");
    btn.firstChild.nodeValue = "Ver más ";
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
    btn.setAttribute("aria-expanded", "true");
    btn.querySelector(".chevron")?.classList.add("rotated");
    btn.firstChild.nodeValue = "Ver menos ";
  }
}
// Render general
function renderCurriculum(formacion, experiencia) {
  const contFormacion = document.getElementById("formacion");
  const contExperiencia = document.getElementById("experiencia");

  formacion.forEach(item => contFormacion.appendChild(crearItem(item, "izq")));
  experiencia.forEach(item => contExperiencia.appendChild(crearItem(item, "der")));
}