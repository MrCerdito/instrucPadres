// ✏️ EDITA AQUÍ LOS DATOS DE ESTUDIANTES
const DATA = [
  { "id":"e-web-01","nombre":"Ingreso al Aula Virtual","categoria":"Estudiantes","plataforma":"Web","link":"https://canva.link/aula-virtual-estudiante","descripcion":"Cómo ingresar al aula virtual desde el navegador" },
  { "id":"e-web-02","nombre":"Consulta de calificaciones","categoria":"Estudiantes","plataforma":"Web","link":"https://canva.link/calificaciones-estudiante","descripcion":"Ver tus notas y boletín de calificaciones" },
  { "id":"e-web-03","nombre":"Agenda Virtual","categoria":"Estudiantes","plataforma":"Web","link":"https://canva.link/agenda-estudiante-web","descripcion":"Consulta de tareas y fechas importantes" },
  { "id":"e-web-04","nombre":"Elecciones estudiantiles","categoria":"Estudiantes","plataforma":"Web","link":"https://canva.link/elecciones-estudiantes","descripcion":"Votación para el gobierno escolar" },
  { "id":"e-web-05","nombre":"Comunicaciones","categoria":"Estudiantes","plataforma":"Web","link":"https://canva.link/comunicaciones-estudiante","descripcion":"Mensajes y circulares de la institución" },
  { "id":"e-app-01","nombre":"Aula Virtual App","categoria":"Estudiantes","plataforma":"App","link":"https://canva.link/aula-virtual-estudiante-app","descripcion":"Acceso a clases y tareas desde el móvil" },
  { "id":"e-app-02","nombre":"Reporte de Notas","categoria":"Estudiantes","plataforma":"App","link":"https://canva.link/notas-estudiante-app","descripcion":"Consulta tus calificaciones en tiempo real" },
  { "id":"e-app-03","nombre":"Agenda Virtual","categoria":"Estudiantes","plataforma":"App","link":"https://canva.link/agenda-estudiante-app","descripcion":"Tareas, actividades y recordatorios" },
  { "id":"e-app-04","nombre":"Comunicaciones","categoria":"Estudiantes","plataforma":"App","link":"https://canva.link/comunicaciones-estudiante-app","descripcion":"Notificaciones y mensajes escolares" },
  { "id":"e-app-05","nombre":"Enfermería","categoria":"Estudiantes","plataforma":"App","link":"https://canva.link/enfermeria-estudiante","descripcion":"Registro de novedades de salud" }
];
const SINGLE_CAT = "Estudiantes";

// =========================================
// NO EDITAR DEBAJO DE ESTA LÍNEA
// =========================================
const CAT_META = {
  Padres:       { emoji: "👨‍👩‍👧", label: "Padres de Familia" },
  Docentes:     { emoji: "🎓",     label: "Docentes" },
  Estudiantes:  { emoji: "📚",     label: "Estudiantes" },
  Administrativos: { emoji: "🏫", label: "Administrativos" },
};

let activeTab = typeof SINGLE_CAT !== "undefined" ? SINGLE_CAT : "todos";

function init() {
  renderStats();
  renderView();
  if (typeof SINGLE_CAT === "undefined") {
    setupTabs();
    document.getElementById("searchWrap").style.display = "";
  } else {
    const sw = document.getElementById("searchWrap");
    if (sw) sw.style.display = "";
  }
  setupSearch();
}

function renderStats() {
  const bar = document.getElementById("stats-bar");
  if (!bar) return;
  if (typeof SINGLE_CAT !== "undefined") {
    const n = DATA.length;
    bar.innerHTML = `<div class="stat-pill"><span>Total </span>${n}</div>`;
  } else {
    const cats = ["Padres","Docentes","Estudiantes"];
    bar.innerHTML = `
      <div class="stat-pill"><span>Total </span>${DATA.length}</div>
      ${cats.map(c => {
        const n = DATA.filter(i => i.categoria === c).length;
        return `<div class="stat-pill"><span>${CAT_META[c].emoji} </span>${n}</div>`;
      }).join("")}
    `;
  }
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTab = btn.dataset.cat;
      const sw = document.getElementById("searchWrap");
      sw.style.display = activeTab === "todos" ? "" : "none";
      document.getElementById("searchInput").value = "";
      renderView();
    });
  });
}

function setupSearch() {
  const inp = document.getElementById("searchInput");
  if (inp) inp.addEventListener("input", renderView);
}

function renderView() {
  const root = document.getElementById("appRoot");
  const inp  = document.getElementById("searchInput");
  const q    = inp ? inp.value.toLowerCase().trim() : "";
  if (activeTab === "todos") {
    renderAll(root, q);
  } else {
    renderCategory(root, activeTab);
  }
}

function renderAll(root, q) {
  const filtered = q
    ? DATA.filter(i => i.nombre.toLowerCase().includes(q) || (i.descripcion||"").toLowerCase().includes(q))
    : DATA;
  if (!filtered.length) { root.innerHTML = emptyHTML("No se encontraron instructivos."); return; }
  const sorted = [...filtered].sort((a,b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre));
  root.innerHTML = `<div class="item-list">${sorted.map((item,i) => cardHTML(item, i+1, true)).join("")}</div>`;
}

function renderCategory(root, cat) {
  const meta = CAT_META[cat] || { emoji:"📋", label: cat };
  const web  = DATA.filter(i => i.categoria === cat && i.plataforma === "Web").sort((a,b) => a.nombre.localeCompare(b.nombre));
  const app  = DATA.filter(i => i.categoria === cat && i.plataforma === "App").sort((a,b) => a.nombre.localeCompare(b.nombre));
  root.innerHTML = `
    <div class="cat-section">
      <div class="cat-header">
        <span class="cat-emoji">${meta.emoji}</span>
        <span class="cat-title">${meta.label}</span>
        <span class="cat-count">${web.length + app.length} instructivos</span>
      </div>
      <div class="plat-grid">
        <div class="plat-col">
          <div class="plat-header"><span class="plat-badge web">🌐 WEB</span></div>
          ${listHTML(web)}
        </div>
        <div class="plat-col">
          <div class="plat-header"><span class="plat-badge app">📱 APP</span></div>
          ${listHTML(app)}
        </div>
      </div>
    </div>`;
}

function listHTML(items) {
  if (!items.length) return emptyHTML("Sin instructivos en esta sección.");
  return `<div class="item-list">${items.map((item,i) => cardHTML(item, i+1, false)).join("")}</div>`;
}

function cardHTML(item, num, showTags) {
  return `
    <a class="item-card" href="${esc(item.link)}" target="_blank" rel="noopener" style="animation-delay:${(num-1)*0.03}s">
      <div class="item-num">${num}</div>
      <div class="item-body">
        <span class="item-name">${esc(item.nombre)}</span>
        ${item.descripcion ? `<span class="item-desc">${esc(item.descripcion)}</span>` : ""}
      </div>
      ${showTags ? `
        <div class="item-tags">
          <span class="tag tag-cat">${esc(item.categoria)}</span>
          <span class="tag ${item.plataforma==="Web"?"tag-web":"tag-app"}">${item.plataforma==="Web"?"🌐":"📱"} ${esc(item.plataforma)}</span>
        </div>` : ""}
      <span class="item-arrow">→</span>
    </a>`;
}

function emptyHTML(msg) {
  return `<div class="empty"><span class="empty-icon">📂</span>${msg}</div>`;
}
function esc(s) {
  return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

init();
