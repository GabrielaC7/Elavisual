
/* ELAVISUAL — SCRIPT.JS */
(() => {
  "use strict";

/* INICIAR LA PÁGINA DESDE ARRIBA */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const root = document.documentElement;
  const home = $("#home-view");
  const categoryView = $("#category-view");
  const projectView = $("#project-view");
  const orderlyView = $("#orderly-view");
  const delioView = $("#delio-view");
  const popup = $("#software-popup");
  const popupPanel = $(".software-popup__panel");
  const nav = $("#nav-links");
  const menuBtn = $("#menu-button");
  const themeBtn = $("#theme-button");
  const motionBtn = $("#motion-button");

  let returnRoute = "#proyectos";
  let popupOrigin = null;
  let popupProgram = null;
  let previousFocus = null;

  function text(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  /* ==========================================
     01. MENÚ Y TEMA
  ========================================== */

  function closeMenu() {
    nav?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    if (menuBtn) menuBtn.textContent = "☰";
  }

  menuBtn?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.textContent = open ? "×" : "☰";
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  $$(".nav-links a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );

  function refreshHeader() {
    $("#site-header")?.classList.toggle(
      "scrolled",
      scrollY > 18 ||
      !home.hidden ||
      location.hash.startsWith("#area/") ||
      location.hash.startsWith("#proyecto/")
    );
  }

  window.addEventListener("scroll", refreshHeader, {
    passive: true
  });

  function setTheme(light) {
    root.classList.toggle("light", light);
    themeBtn.textContent = light ? "☀" : "☾";
    themeBtn.setAttribute(
      "aria-label",
      light ? "Activar modo oscuro" : "Activar modo claro"
    );
    try {
      localStorage.setItem(
        "elavisual-theme",
        light ? "light" : "dark"
      );
    } catch (_) {}
  }

  setTheme(root.classList.contains("light"));

  themeBtn?.addEventListener("click", () => {
    setTheme(!root.classList.contains("light"));
  });

  /* ==========================================
     02. MOVIMIENTO REDUCIDO
  ========================================== */

  const systemMotion = matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function savedMotion() {
    try {
      return localStorage.getItem(
        "elavisual-reducir-movimiento"
      ) === "si";
    } catch (_) {
      return false;
    }
  }

  let userMotion = savedMotion();

  function refreshMotion() {
    const reduced = userMotion || systemMotion.matches;
    root.classList.toggle("reduce-motion", reduced);

    motionBtn.textContent = reduced ? "●" : "◌";
    motionBtn.setAttribute("aria-pressed", String(reduced));
    motionBtn.title = reduced
      ? "Activar animaciones"
      : "Reducir animaciones";

    if (reduced) finishIntro(true);
  }

  motionBtn?.addEventListener("click", () => {
    userMotion = !userMotion;
    try {
      localStorage.setItem(
        "elavisual-reducir-movimiento",
        userMotion ? "si" : "no"
      );
    } catch (_) {}
    refreshMotion();
  });

  systemMotion.addEventListener?.("change", refreshMotion);

  /* ==========================================
     03. ANIMACIÓN DE ENTRADA

     Se repite al actualizar con F5/Ctrl+R.
     No se repite al navegar dentro del sitio.
  ========================================== */

  const intro = $("#intro-screen");
  let introFinished = false;
  let introTimer = null;

 

function finishIntro(immediate = false) {

  if (!intro || introFinished) return;

  introFinished = true;
  clearTimeout(introTimer);

  // Mostrar el título cuando termine la carga.
  function iniciarAnimacionHero() {

    const estaEnInicio =
      !location.hash ||
      location.hash === "#inicio";

    if (estaEnInicio) {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });

      // Activar la animación del título.
      document.body.classList.add("hero-animate");
    }
  }

  // Si se omite la animación de entrada.
  if (
    immediate ||
    root.classList.contains("reduce-motion")
  ) {

    intro.hidden = true;
    iniciarAnimacionHero();

  } else {

    // Desaparece la pantalla del logo.
    intro.classList.add("exiting");

    setTimeout(() => {

      intro.hidden = true;

      // Solo ahora aparece el título.
      iniciarAnimacionHero();

    }, 100);
  }
}


  $("#intro-skip")?.addEventListener("click", () => {
    finishIntro(true);
    $("#site-header .logo")?.focus();
  });

  intro?.addEventListener("keydown", event => {
    if (event.key === "Escape") finishIntro(true);
    if (event.key === "Tab" && !introFinished) {
      event.preventDefault();
      $("#intro-skip")?.focus();
    }
  });

  refreshMotion();

  if (root.classList.contains("reduce-motion")) {
    finishIntro(true);
  } else {
    $("#intro-skip")?.focus({ preventScroll: true });
    introTimer = setTimeout(() => finishIntro(), 1500);
  }

  /* ==========================================
     04. ANIMACIÓN DE SECCIONES
  ========================================== */

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("shown");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });

    $$(".reveal").forEach(el => observer.observe(el));
  }

  /* ==========================================
     05. PROYECTOS DEL PORTAFOLIO

     Estos son proyectos de demostración.
     Puedes reemplazar sus títulos, imágenes
     y descripciones por tus trabajos reales.
  ========================================== */

  const proyectos = {
    "detras-de-la-camara": {
      titulo: "Detrás de la cámara",
      tipo: "Folleto editorial",
      area: "editorial",
      origen: "universitario",
      portada: "img/proyectos/detras-camara.jpg",
      programas: ["illustrator", "photoshop"],
      anio: "2026",
      color: "",
      resumen:
        "Diseño editorial de un folleto sobre grandes " +
        "directores de cine y narrativa gráfica.",
      reto:
        "Organizar contenido cinematográfico aplicando " +
        "jerarquía visual, retículas y composición editorial.",
      propuesta:
        "Desarrollar una identidad visual consistente " +
        "entre portada, páginas interiores y contraportada.",
      resultado:
        "Un concepto editorial que combina tipografía, " +
        "composición y referencias cinematográficas.",
      pasos: [
        ["Investigación", "Selección de referencias visuales."],
        ["Bocetos", "Estudio de retículas y tipografía."],
        ["Arte final", "Composición y exportación del folleto."]
      ],
      galeria: [
        ["Portada / boceto", ""],
        ["Páginas interiores", ""]
      ]
      
    },

    "ritmo-y-color": {
      titulo: "Ritmo & color",
      portada: "img/proyectos/ritmo-color.jpg",
      tipo: "Afiche promocional",
      area: "grafico",
      origen: "universitario",
      programas: ["illustrator", "photoshop"],
      anio: "2026",
      color: "visual-pink",
      resumen:
        "Exploración de un afiche publicitario " +
        "con color, composición y formas expresivas.",
      reto:
        "Comunicar visualmente un evento mediante " +
        "una composición de alto impacto.",
      propuesta:
        "Utilizar una paleta dinámica y jerarquía tipográfica.",
      resultado:
        "Un concepto promocional de carácter enérgico.",
      pasos: [
        ["Referencias", "Moodboard y estudio cromático."],
        ["Composición", "Pruebas de formas y textos."],
        ["Resultado", "Ajustes de contraste y exportación."]
      ],
      galeria: [
        ["Moodboard", ""],
        ["Afiche final", ""]
      ]
    },

    "figura-y-fondo": {
      titulo: "Figura & fondo",
      portada: "img/proyectos/figura-fondo.jpg",
      tipo: "Afiche / Gestalt",
      area: "grafico",
      origen: "universitario",
      programas: ["illustrator"],
      anio: "2026",
      color: "visual-cyan",
      resumen:
        "Composición gráfica basada en percepción " +
        "visual y la ley de figura-fondo.",
      reto:
        "Crear una imagen con una relación clara " +
        "entre figura y espacio negativo.",
      propuesta:
        "Explorar contraste, siluetas y geometría.",
      resultado:
        "Un concepto de afiche que enfatiza la percepción.",
      pasos: [
        ["Exploración", "Bocetos y siluetas."],
        ["Contraste", "Selección cromática."],
        ["Resultado", "Aplicación final del principio Gestalt."]
      ],
      galeria: [
        ["Pruebas de siluetas", ""],
        ["Diseño final", ""]
      ]
    },

    "create-studio-ui": {
      titulo: "Create Studio UI",
      portada: "img/proyectos/create-studio.jpg",
      tipo: "Diseño UI / UX",
      area: "ui",
      origen: "personal",
      programas: ["figma"],
      anio: "2026",
      color: "visual-lime",
      resumen:
        "Concepto de interfaz para explorar proyectos " +
        "y recursos creativos.",
      reto:
        "Crear una interfaz visualmente clara " +
        "y fácil de utilizar.",
      propuesta:
        "Diseñar componentes, tarjetas y una navegación intuitiva.",
      resultado:
        "Un concepto de interfaz digital con identidad creativa.",
      pasos: [
        ["Estructura", "Flujo de usuario."],
        ["Wireframes", "Organización de elementos."],
        ["Prototipo", "Pantallas y estados interactivos."]
      ],
      galeria: [
        ["Wireframes", ""],
        ["Pantallas UI", ""]
      ]
    },

    "reel-creativo": {
      titulo: "Reel creativo",
      tipo: "Edición de video",
      area: "video",
      origen: "demostracion",
      programas: ["premiere", "after-effects"],
      anio: "2026",
      color: "visual-pink",
      resumen:
        "Ejemplo de edición audiovisual con ritmo " +
        "y tipografía en movimiento.",
      reto:
        "Organizar imágenes y sonido.",
      propuesta:
        "Utilizar montaje y transiciones.",
      resultado:
        "Ejercicio de ritmo audiovisual.",
      pasos: [
        ["Material", "Selección de clips."],
        ["Montaje", "Edición de secuencias."],
        ["Finalización", "Exportación."]
      ],
      galeria: [
        ["Línea de tiempo", ""],
        ["Fotograma final", ""]
      ]
    },

    "narrativa-audiovisual": {
      titulo: "Narrativa audiovisual",
      tipo: "Storytelling / video",
      area: "video",
      origen: "demostracion",
      programas: ["premiere", "davinci"],
      anio: "2026",
      color: "visual-cyan",
      resumen:
        "Ejemplo de montaje audiovisual orientado " +
        "a contar historias.",
      reto: "Transmitir una historia con continuidad.",
      propuesta: "Organizar planos, ritmo y sonido.",
      resultado: "Ejercicio de narrativa audiovisual.",
      pasos: [
        ["Storyboard", "Planificación visual."],
        ["Edición", "Orden de planos."],
        ["Acabado", "Corrección y exportación."]
      ],
      galeria: [
        ["Storyboard", ""],
        ["Secuencia final", ""]
      ]
      
    },

"cafe-santo-domingo": {
  titulo: "Café Santo Domingo",
  portada: "img/proyectos/cafe-santo-domingo.jpg",
  tipo: "Afiche publicitario vintage",
  area: "grafico",
  origen: "universitario",
  programas: ["illustrator"],
  anio: "2026",
  color: "visual-pink",

  resumen:
    "Afiche publicitario retro y vintage " +
    "con una composición minimalista.",

  reto:
    "Crear una propuesta publicitaria inspirada " +
    "en el diseño de afiches antiguos.",

  propuesta:
    "Combinar tipografía vintage, colores cálidos " +
    "y una composición visual equilibrada.",

  resultado:
    "Una propuesta de afiche publicitario " +
    "con identidad retro.",

  pasos: [
    ["Investigación", "Referencias visuales vintage."],
    ["Bocetos", "Pruebas de composición."],
    ["Diseño final", "Aplicación de colores y tipografía."]
  ],

  galeria: [
    ["Bocetos", ""],
    ["Afiche final", "img/proyectos/cafe-santo-domingo.jpg"]
  ]
},

"orderly": {
  titulo: "ORDERLY — Food Delivery",
  tipo: "Aplicación móvil UX/UI",
  area: "ui",
  origen: "personal",
  programas: ["figma"],
  anio: "2026",
  portada: "",
  color: "visual-pink",

  resumen:
    "Diseño de una aplicación de pedidos " +
    "de comida con personalización y seguimiento.",

  reto:
    "Organizar las principales funciones " +
    "de una experiencia de pedidos a domicilio.",

  propuesta:
    "Diseñar una interfaz móvil con búsqueda, " +
    "carrito, checkout y seguimiento.",

  resultado:
    "Prototipo conceptual e interactivo " +
    "desarrollado en Figma.",

  pasos: [
    ["Estructura", "Organización de flujos."],
    ["Interfaz", "Diseño de componentes y pantallas."],
    ["Prototipo", "Conexión de interacciones."]
  ],

  galeria: []
},

    
"delio-smartphone": {
  titulo: "Delio Smartphone",
  tipo: "Identidad visual / Branding",
  area: "grafico",
  origen: "trabajo",
  programas: ["illustrator", "photoshop"],
  anio: "2026",
  portada: "img/proyectos/delio-portada.jpg",
  color: "",

  resumen:
    "Desarrollo de un sistema de identidad visual " +
    "para Delio Smartphone, integrando logotipo, " +
    "tipografía, colores y aplicaciones de marca.",

  reto:
    "Organizar los elementos visuales de la marca " +
    "en un sistema consistente y fácil de aplicar.",

  propuesta:
    "Establecer normas de uso del logotipo, " +
    "paleta cromática, tipografía Montserrat " +
    "y aplicaciones de identidad.",

  resultado:
    "Propuesta de sistema de identidad visual " +
    "con manual de marca y aplicaciones gráficas.",

  pasos: [
    ["Análisis", "Revisión de las necesidades visuales de la marca."],
    ["Identidad", "Definición del logotipo y los elementos gráficos."],
    ["Normativa", "Construcción de reglas de uso y área de seguridad."],
    ["Aplicaciones", "Desarrollo de tarjetas y presentaciones de marca."]
  ],

  galeria: [
    ["Logotipo", "img/proyectos/delio-logo.jpg"],
    ["Manual de identidad", "img/proyectos/delio-manual.jpg"],
    ["Tarjetas de presentación", "img/proyectos/delio-tarjetas.jpg"],
    ["Mockup", "img/proyectos/delio-mockup.jpg"]
  ]
},

  };
  

  const slugs = Object.keys(proyectos);

  /* ==========================================
     06. PROGRAMAS Y CATEGORÍAS
  ========================================== */

  const programas = {
    photoshop: {
      nombre: "Adobe Photoshop",
      icono: "Ps",
      color: "#31a8ff",
      descripcion: "Retoque, composición y fotomontaje"
    },
    illustrator: {
      nombre: "Adobe Illustrator",
      icono: "Ai",
      color: "#ff9a00",
      descripcion: "Vectores, afiches e identidad visual"
    },
    "after-effects": {
      nombre: "Adobe After Effects",
      icono: "Ae",
      color: "#b49aff",
      descripcion: "Animación y motion graphics"
    },
    premiere: {
      nombre: "Adobe Premiere Pro",
      icono: "Pr",
      color: "#9999ff",
      descripcion: "Montaje y edición audiovisual"
    },
    figma: {
      nombre: "Figma",
      icono: "Fg",
      color: "#f9a57b",
      descripcion: "Interfaces y prototipos"
    },
    davinci: {
      nombre: "DaVinci Resolve",
      icono: "Dv",
      color: "#7ae5f4",
      descripcion: "Edición y corrección de color"
    }
  };

  const apartados = {
    universitario: {
      titulo: "Proyectos universitarios",
      label: "01 / UNIVERSITARIOS",
      descripcion:
        "Trabajos académicos organizados por programa.",
      inicial: "illustrator",
      orden: [
        "photoshop",
        "illustrator",
        "after-effects",
        "premiere",
        "figma"
      ]
    },
    personal: {
      titulo: "Proyectos personales",
      label: "02 / PERSONALES",
      descripcion:
        "Ideas personales y experimentos independientes.",
      inicial: "figma",
      orden: [
        "figma",
        "photoshop",
        "illustrator",
        "after-effects",
        "davinci"
      ]
    },
    trabajo: {
      titulo: "Trabajos y clientes",
      label: "03 / TRABAJOS",
      descripcion:
        "Proyectos profesionales y colaboraciones.",
      inicial: "illustrator",
      orden: [
        "illustrator",
        "photoshop",
        "figma",
        "premiere",
        "after-effects"
      ]
    }
  };

  const areas = {
    grafico: {
      titulo: "Diseño gráfico",
      icono: "✎",
      descripcion:
        "Afiches, composición, identidad visual " +
        "y experimentos de color."
    },
    video: {
      titulo: "Edición de video",
      icono: "▣",
      descripcion:
        "Montaje, storytelling y piezas audiovisuales."
    },
    editorial: {
      titulo: "Diseño editorial",
      icono: "✳",
      descripcion:
        "Retículas, folletos y publicaciones."
    },
    ui: {
      titulo: "Diseño UI / UX",
      icono: "⌘",
      descripcion:
        "Interfaces, prototipos y experiencias digitales."
    }
  };

  /* ==========================================
     07. CREAR TARJETA VISUAL DE UN PROYECTO
  ========================================== */

 
/* ==========================================
   TARJETAS CON VISTA PREVIA - ELAVISUAL
========================================== */

function createProjectCard(slug, sourceRoute) {

  const p = proyectos[slug];
  if (!p) return null;

  const card = document.createElement("a");

  card.className = "project-card";
  card.href = "#proyecto/" + slug;

  // CONTENEDOR DE LA PORTADA
  const visual = document.createElement("div");

  visual.className = "project-visual " + (p.color || "");

  // Si existe una imagen configurada.
  if (p.portada) {

    const imagen = document.createElement("img");

    imagen.className = "project-preview-image";
    imagen.src = p.portada;
    imagen.alt = "Vista previa de " + p.titulo;
    imagen.loading = "lazy";
    imagen.decoding = "async";

    // Si el archivo no existe, mostrar
    // la portada gráfica original.
    imagen.addEventListener("error", () => {
      imagen.remove();
      visual.classList.remove("has-preview");
    });

    visual.classList.add("has-preview");
    visual.appendChild(imagen);
  }

  const visualTitle = document.createElement("strong");
  visualTitle.textContent = p.titulo;

  visual.appendChild(visualTitle);

  // INFORMACIÓN DEL PROYECTO
  const copy = document.createElement("div");
  copy.className = "project-card-copy";

  const type = document.createElement("span");
  type.textContent = p.tipo.toUpperCase();

  const heading = document.createElement("h3");
  heading.textContent = p.titulo;

  const description = document.createElement("p");
  description.textContent = p.resumen;

  const cta = document.createElement("b");
  cta.textContent = "Explorar proyecto ↗";

  copy.append(type, heading, description, cta);

  card.append(visual, copy);

  // Mantener la navegación anterior.
  card.addEventListener("click", () => {
    returnRoute = sourceRoute;
  });

  return card;
}


  /* ==========================================
     08. VENTANAS EMERGENTES POR PROGRAMA
  ========================================== */

  function closePopup() {
    popup.hidden = true;
    document.body.classList.remove("popup-open");
  }

  function closePopupToHome() {
    location.hash = "proyectos";
    closePopup();
  }

  function showProgram(id) {
    if (!popupOrigin || !programas[id]) return;

    popupProgram = id;

    const program = programas[id];

    text("#popup-program", program.nombre);

    $$(".software-app", popup).forEach(btn => {
      const active = btn.dataset.software === id;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    const results = $("#popup-projects");
    results.replaceChildren();

    const matches = slugs.filter(slug => {
      const p = proyectos[slug];
      return p.origen === popupOrigin &&
        p.programas.includes(id);
    });

    text(
      "#popup-count",
      matches.length + (matches.length === 1
        ? " proyecto" : " proyectos")
    );

    if (!matches.length) {
      results.innerHTML = `
        <div class="popup-empty">
          <strong>✳ Próximamente</strong>
          <p>
            Todavía no hay proyectos publicados
            con este programa en este apartado.
          </p>
        </div>
      `;
      return;
    }

    matches.forEach(slug => {
      results.appendChild(
        createProjectCard(
          slug,
          "#portafolio/" + popupOrigin
        )
      );
    });
  }

  function openPopup(origin) {
    const group = apartados[origin];
    if (!group) return;

    const changed = popupOrigin !== origin;

    popupOrigin = origin;

    if (changed || !popupProgram ||
        !group.orden.includes(popupProgram)) {
      popupProgram = group.inicial;
    }

    text("#popup-label", group.label);
    text("#popup-title", group.titulo);
    text("#popup-description", group.descripcion);

    const appContainer = $("#popup-apps");
    appContainer.replaceChildren();

    group.orden.forEach(id => {
      const app = programas[id];

      const count = slugs.filter(slug => {
        const p = proyectos[slug];
        return p.origen === origin &&
          p.programas.includes(id);
      }).length;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "software-app";
      button.dataset.software = id;
      button.style.setProperty("--app-color", app.color);

   
const icon = document.createElement("span");

icon.className =
  "software-app-icon software-icon-" + id;

icon.textContent = app.icono;

icon.setAttribute("aria-hidden", "true");


      const title = document.createElement("strong");
      title.textContent = app.nombre;

      const desc = document.createElement("small");
      desc.textContent = app.descripcion;

      const number = document.createElement("em");
      number.textContent = count
        ? count + (count === 1 ? " proyecto" : " proyectos")
        : "Próximamente";

      button.append(icon, title, desc, number);

      button.addEventListener("click", () => {
        showProgram(id);
        const reduced = root.classList.contains("reduce-motion");
        $("#popup-program").scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "center"
        });
      });

      appContainer.appendChild(button);
    });

    showProgram(popupProgram);

    popup.hidden = false;
    document.body.classList.add("popup-open");
    popupPanel.scrollTop = 0;

    $("#popup-close").focus({ preventScroll: true });
    document.title = group.titulo + " | ElaVisual";
  }

  $("#popup-close").addEventListener("click", closePopupToHome);

  popup.addEventListener("click", event => {
    if (event.target === popup) closePopupToHome();
  });

  document.addEventListener("keydown", event => {
    if (popup.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closePopupToHome();
    }

    if (event.key !== "Tab") return;

    const focusable = $$(
      'button:not([disabled]),a[href]',
      popupPanel
    ).filter(el => el.getClientRects().length);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey &&
        document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey &&
               document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  $$("[data-portfolio-link]").forEach(link => {
    link.addEventListener("click", () => {
      previousFocus = link;
    });
  });

  /* ==========================================
     09. PÁGINAS DE ÁREAS CREATIVAS
  ========================================== */

  function renderCategory(id) {
    const area = areas[id];
    if (!area) return;

    text("#category-eyebrow",
      "03 / " + area.titulo.toUpperCase());

    text("#category-title", area.titulo);
    text("#category-description", area.descripcion);

    $$(".category-mini-nav a").forEach(link => {
      const active = link.getAttribute("href") === "#area/" + id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const grid = $("#category-projects");
    grid.replaceChildren();

    const matches = slugs.filter(slug =>
      proyectos[slug].area === id
    );

    matches.forEach(slug => {
      grid.appendChild(
        createProjectCard(slug, "#area/" + id)
      );
    });

    if (!matches.length) {
      grid.innerHTML = '<p class="muted">Próximamente nuevos proyectos.</p>';
    }

    document.title = area.titulo + " | ElaVisual";
  }

  /* ==========================================
     10. FICHA COMPLETA DEL PROYECTO
  ========================================== */

  function renderProject(slug) {
    const p = proyectos[slug];
    if (!p) return;

    text("#case-eyebrow", "PROYECTO / " + p.tipo.toUpperCase());
    text("#case-title", p.titulo);
    text("#case-summary", p.resumen);
    text("#case-category", areas[p.area]?.titulo || p.area);
    text("#case-type", p.tipo);
    text("#case-date", p.anio);
    text("#case-challenge", p.reto);
    text("#case-approach", p.propuesta);
    text("#case-result", p.resultado);

    const cover = $("#case-cover");
    cover.replaceChildren();

    const visual = document.createElement("div");
    visual.className = "project-visual " + p.color;

    const title = document.createElement("strong");
    title.textContent = p.titulo;
    visual.appendChild(title);

    cover.appendChild(visual);

    const tools = $("#case-tools");
    tools.replaceChildren();

    p.programas.forEach(id => {
      const chip = document.createElement("span");
      chip.textContent = programas[id]?.nombre || id;
      tools.appendChild(chip);
    });

    const process = $("#case-process");
    process.replaceChildren();

    p.pasos.forEach(([name, description], index) => {
      const card = document.createElement("article");
      card.className = "info-card";

      const number = document.createElement("span");
      number.textContent =
        String(index + 1).padStart(2, "0") + " / PROCESO";

      const heading = document.createElement("h3");
      heading.textContent = name;

      const paragraph = document.createElement("p");
      paragraph.textContent = description;

      card.append(number, heading, paragraph);
      process.appendChild(card);
    });

   
/* GALERÍA INTERACTIVA CON MOCKUPS Y ZOOM */

const gallery = $("#case-gallery");
gallery.replaceChildren();

const galeriaActual = [];

const tiposMockup = {
  grafico: "poster",
  editorial: "editorial",
  ui: "device",
  video: "screen"
};

p.galeria.forEach(([name, file]) => {

  const figure = document.createElement("figure");
  figure.className = "case-gallery-item";

  const frame = document.createElement("div");
  frame.className = "elavisual-mockup";

  frame.classList.add(
    "mockup-" + (tiposMockup[p.area] || "poster")
  );

  if (file) {

    const imageIndex = galeriaActual.length;

    galeriaActual.push({
      src: file,
      title: name
    });

    const button = document.createElement("button");
    button.type = "button";
    button.className = "mockup-zoom";
    button.setAttribute(
      "aria-label",
      "Ampliar imagen: " + name
    );

    const image = document.createElement("img");
    image.src = file;
    image.alt = name;
    image.loading = "lazy";
    image.decoding = "async";

    const zoomLabel = document.createElement("span");
    zoomLabel.className = "mockup-zoom-label";
    zoomLabel.textContent = "Ampliar imagen ↗";

    image.addEventListener("error", () => {
      button.disabled = true;
      zoomLabel.textContent = "Imagen no disponible";
    });

    button.append(image, zoomLabel);
    frame.appendChild(button);

    button.addEventListener("click", () => {
      abrirGaleria(
        galeriaActual,
        imageIndex,
        p.titulo
      );
    });

  } else {

    const placeholder = document.createElement("div");
    placeholder.className = "mockup-placeholder";

    const symbol = document.createElement("span");
    symbol.textContent = "✳";

    const title = document.createElement("strong");
    title.textContent = name;

    const note = document.createElement("small");
    note.textContent = "IMAGEN PENDIENTE";

    placeholder.append(symbol, title, note);
    frame.appendChild(placeholder);
  }

  const caption = document.createElement("figcaption");

  const captionTitle = document.createElement("strong");
  captionTitle.textContent = name;

  const captionType = document.createElement("span");
  captionType.textContent = file
    ? "VER IMAGEN ↗"
    : "PRÓXIMAMENTE";

  caption.append(captionTitle, captionType);

  figure.append(frame, caption);
  gallery.appendChild(figure);

});


    $("#case-back").href = returnRoute;
    $("#case-back-bottom").href = returnRoute;

    const nextSlug = slugs[
      (slugs.indexOf(slug) + 1) % slugs.length
    ];

    $("#case-next").href = "#proyecto/" + nextSlug;
    $("#case-next").textContent =
      "Siguiente: " + proyectos[nextSlug].titulo + " ↗";

    document.title = p.titulo + " | ElaVisual";
  }

  /* ==========================================
     11. NAVEGACIÓN DE TODO EL SITIO
  ========================================== */

 
/* ==========================================
   NAVEGACIÓN CON ORDERLY
========================================== */

/* ==========================================
   DELIO / GALERÍA DE BRANDING
========================================== */

function renderDelioGallery() {
  const container = $("#delio-gallery");
  const proyecto = proyectos["delio-smartphone"];

  if (!container || !proyecto) return;

  container.replaceChildren();

  const images = proyecto.galeria
    .filter(([, file]) => Boolean(file))
    .map(([title, src]) => ({ title, src }));

  proyecto.galeria.forEach(([name, file]) => {

    const figure = document.createElement("figure");
    figure.className = "delio-gallery-item";

    const caption = document.createElement("figcaption");
    caption.textContent = name;

    if (file) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", "Ampliar " + name);

      const image = document.createElement("img");
      image.src = file;
      image.alt = name;
      image.loading = "lazy";

      image.addEventListener("error", () => {
        button.remove();

        const placeholder = document.createElement("div");
        placeholder.className = "delio-gallery-placeholder";
        placeholder.textContent =
          "Imagen pendiente: " + name;

        figure.prepend(placeholder);
      });

      button.addEventListener("click", () => {
        const index = images.findIndex(
          item => item.src === file &&
                  item.title === name
        );

        if (index !== -1) {
          abrirGaleria(
            images,
            index,
            "Delio Smartphone"
          );
        }
      });

      button.appendChild(image);
      figure.appendChild(button);

    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "delio-gallery-placeholder";
      placeholder.textContent =
        "Imagen pendiente: " + name;

      figure.appendChild(placeholder);
    }

    figure.appendChild(caption);
    container.appendChild(figure);
  });
}

/* IR A LA GALERÍA DE DELIO */

$("#delio-scroll-gallery")?.addEventListener(
  "click",
  () => {
    $("#delio-galeria")?.scrollIntoView({
      behavior: root.classList.contains("reduce-motion")
        ? "auto"
        : "smooth",
      block: "start"
    });
  }
);

/* ==========================================
   DELIO — MANUAL DE IDENTIDAD INTERACTIVO
========================================== */

function initDelioManual() {

  const manual = document.querySelector("#delio-manual");
  const viewer = document.querySelector("#delio-book-page");
  const prev = document.querySelector("#delio-book-prev");
  const next = document.querySelector("#delio-book-next");
  const counter = document.querySelector("#delio-manual-counter");
  const progress = document.querySelector("#delio-book-progress");
  const chapter = document.querySelector("#delio-book-chapter");

  if (
    !manual || !viewer || !prev || !next ||
    !counter || !progress || !chapter
  ) return;

const logo = "DELIO_LOGOTIPO-01.png";
  const simbolo = "DELIO_LOGOTIPO-03.png";

  const paginas = [

    /* 01 — PORTADA */
    {
      titulo: "Portada",
      tema: "dark",
      contenido: `
        <div class="book-page-body centered">
          <img src="${logo}"
               alt="Delio Smartphone">

          <h3>Brand Identity System</h3>

          <p>Manual de identidad visual · 2026</p>
        </div>
      `
    },

    /* 02 — PRESENTACIÓN */
    {
      titulo: "Presentación",
      tema: "light",
      contenido: `
        <div class="book-page-body">

          <span class="book-accent">
            01 / PRESENTACIÓN
          </span>

          <h3>Delio Smartphone</h3>

          <p>
            Delio Smartphone es un negocio del
            sector tecnológico ubicado en Santo
            Domingo, República Dominicana.
          </p>

          <p>
            Este sistema de identidad visual
            organiza los elementos gráficos
            de la marca y establece criterios
            para su aplicación consistente.
          </p>

          <p>
            El manual reúne el logotipo,
            la paleta cromática, la tipografía
            y las principales normas visuales.
          </p>

        </div>
      `
    },

    /* 03 — CONCEPTO VISUAL */
    {
      titulo: "Concepto visual",
      tema: "dark",
      contenido: `
        <div class="book-page-body centered">

          <span class="book-accent">
            02 / CONCEPTO VISUAL
          </span>

          <img src="${simbolo}"
               alt="Símbolo de Delio Smartphone">

          <h3>Tecnología y movimiento.</h3>

          <p>
            El símbolo integra una referencia
            al dispositivo móvil con un elemento
            orbital, evocando movimiento,
            conexión y tecnología.
          </p>

        </div>
      `
    },

    /* 04 — LOGOTIPO */
    {
      titulo: "Logotipo",
      tema: "dark",
      contenido: `
        <div class="book-page-body centered">

          <span class="book-accent">
            03 / IDENTIDAD PRINCIPAL
          </span>

          <img src="${logo}"
               alt="Logotipo completo de Delio">

          <h3>Identidad principal</h3>

          <p>
            El logotipo reúne el símbolo
            gráfico y la denominación
            DELIO SMARTPHONE.
          </p>

          <p>
            Su presentación busca mantener
            el reconocimiento y la legibilidad
            de la marca.
          </p>

        </div>
      `
    },

    /* 05 — COLORES */
    {
      titulo: "Paleta cromática",
      tema: "light",
      contenido: `
        <div class="book-page-body">

          <span class="book-accent">
            04 / SISTEMA CROMÁTICO
          </span>

          <h3>Paleta cromática</h3>

          <p>
            Cuatro colores forman el sistema
            cromático de Delio Smartphone.
          </p>

          <div class="book-swatches">

            <div class="book-swatch"
                 style="background:#A92522;color:white">
              <strong>Rojo</strong>
              <span>#A92522</span>
            </div>

            <div class="book-swatch"
                 style="background:#19191B;color:white">
              <strong>Negro</strong>
              <span>#19191B</span>
            </div>

            <div class="book-swatch"
                 style="background:#FFFFFF;color:#19191B">
              <strong>Blanco</strong>
              <span>#FFFFFF</span>
            </div>

            <div class="book-swatch"
                 style="background:#A6A6AA;color:#19191B">
              <strong>Gris</strong>
              <span>#A6A6AA</span>
            </div>

          </div>

        </div>
      `
    },

    /* 06 — TIPOGRAFÍA */
    {
      titulo: "Tipografía",
      tema: "light",
      contenido: `
        <div class="book-page-body">

          <span class="book-accent">
            05 / TIPOGRAFÍA CORPORATIVA
          </span>

          <h3>Tipografía de marca</h3>

          <div class="book-font-name">
            Montserrat
          </div>

          <p>
            La familia tipográfica Montserrat
            permite establecer jerarquías
            y mantener coherencia visual.
          </p>

          <div class="book-font-weights">
            <span style="font-weight:800">Bold</span>
            <span style="font-weight:600">SemiBold</span>
            <span style="font-weight:500">Medium</span>
            <span style="font-weight:400">Regular</span>
          </div>

          <h3>Aa Bb Cc 123</h3>

        </div>
      `
    },

    /* 07 — ÁREA DE SEGURIDAD */
    {
      titulo: "Área de seguridad",
      tema: "dark",
      contenido: `
        <div class="book-page-body centered">

          <span class="book-accent">
            06 / NORMAS DE IDENTIDAD
          </span>

          <h3>Área de seguridad</h3>

          <div class="book-safe-area">
            <div class="book-safe-inner">
              <img src="${logo}"
                   alt="Logotipo dentro del área de protección">
            </div>
          </div>

          <p>
            La unidad X corresponde a la
            altura de la letra D del logotipo.
            Se utiliza para establecer el
            espacio mínimo de protección.
          </p>

          <p>
            Esquema ilustrativo. Las proporciones
            exactas se consultan en el manual
            vectorial original.
          </p>

        </div>
      `
    },

    /* 08 — USOS DE MARCA */
    {
      titulo: "Usos de marca",
      tema: "light",
      contenido: `
        <div class="book-page-body">

          <span class="book-accent">
            07 / USOS DE IDENTIDAD
          </span>

          <h3>Consistencia visual</h3>

          <div class="book-use-grid">

            <div class="book-use"
                 style="background:#19191B;color:white">

              <strong>✓ Uso correcto</strong>

              <img src="${logo}"
                   alt="Logotipo sin deformación">

            </div>

            <div class="book-use book-use-bad"
                 style="background:#DDDDDD;color:#19191B">

              <strong>✕ Uso incorrecto</strong>

              <img src="${logo}"
                   alt="Ejemplo de logotipo deformado">

            </div>

          </div>

          <p>
            Se debe respetar la proporción
            original del logotipo y evitar
            deformaciones o modificaciones
            no autorizadas.
          </p>

        </div>
      `
    },

    /* 09 — APLICACIONES */
    {
      titulo: "Aplicaciones",
      tema: "light",
      contenido: `
        <div class="book-page-body">

          <span class="book-accent">
            08 / APLICACIONES
          </span>

          <h3>La identidad aplicada</h3>

          <p>
            Ejemplos conceptuales de
            implementación de la identidad
            en soportes físicos y digitales.
          </p>

          <div class="book-applications">

            <div class="book-application">
              <img src="${logo}"
                   alt="Marca aplicada a tarjeta">
            </div>

            <div class="book-application"
                 style="background:#A92522">
              <span>DELIO SMARTPHONE</span>
            </div>

          </div>

          <p>
            Los diseños definitivos se presentan
            en la sección de aplicaciones
            del portafolio.
          </p>

        </div>
      `
    },

    /* 10 — CONTRAPORTADA */
    {
      titulo: "Contraportada",
      tema: "dark",
      contenido: `
        <div class="book-page-body centered">

          <img src="${logo}"
               alt="Delio Smartphone">

          <h3>Brand Identity System</h3>

          <p>DELIO SMARTPHONE · 2026</p>

        </div>
      `
    }
  ];

  let paginaActual = 0;

  /* CREAR LA PÁGINA */

  function mostrarPagina(indice) {

    if (indice < 0 || indice >= paginas.length) return;

    paginaActual = indice;

    const pagina = paginas[paginaActual];

    viewer.innerHTML = `
      <article class="delio-book-sheet ${pagina.tema}">

        <div class="book-page-top">
          <span>DELIO SMARTPHONE</span>
          <span>BRAND IDENTITY SYSTEM</span>
        </div>

        ${pagina.contenido}

        <div class="book-page-bottom">
          <span>BRAND IDENTITY · 2026</span>

          <span class="book-page-number">
            ${String(paginaActual + 1).padStart(2,"0")}
          </span>
        </div>

      </article>
    `;

    counter.textContent =
      String(paginaActual + 1).padStart(2,"0") +
      " / " +
      String(paginas.length).padStart(2,"0");

    chapter.textContent = pagina.titulo;

    prev.disabled = paginaActual === 0;
    next.disabled = paginaActual === paginas.length - 1;

    /* ACTUALIZAR PUNTOS */

    progress.replaceChildren();

    paginas.forEach((item, index) => {

      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "delio-book-dot";

      dot.setAttribute(
        "aria-label",
        "Ir a página " + (index + 1) +
        ": " + item.titulo
      );

      if (index === paginaActual) {
        dot.classList.add("active");
        dot.setAttribute("aria-current", "page");
      }

      dot.addEventListener("click", () => {
        mostrarPagina(index);
      });

      progress.appendChild(dot);
    });
  }

  /* BOTONES DE NAVEGACIÓN */

  prev.addEventListener("click", () => {
    mostrarPagina(paginaActual - 1);
  });

  next.addEventListener("click", () => {
    mostrarPagina(paginaActual + 1);
  });

  /* FLECHAS DEL TECLADO */

  manual.addEventListener("keydown", (event) => {

    if (!manual.open) return;

    const target = event.target;

    if (
      target.closest("summary") ||
      target.matches("input,textarea,select")
    ) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      mostrarPagina(paginaActual + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      mostrarPagina(paginaActual - 1);
    }
  });

  /* MOSTRAR PORTADA AL INICIAR */

  mostrarPagina(0);
}

/* INICIALIZAR UNA SOLA VEZ */

initDelioManual();

/* ==========================================
   DELIO — TARJETAS INTERACTIVAS
========================================== */


/* ==========================================
   DELIO — TARJETAS 3D INTERACTIVAS
========================================== */

function initDelioCards() {
  const section = document.querySelector("#delio-tarjetas");

  if (!section || section.dataset.initialized === "true") {
    return;
  }

  const buttons = [
    ...section.querySelectorAll("[data-delio-card]")
  ];

  const floating = section.querySelector("#delio-card-floating");
  const rotator = section.querySelector("#delio-card-rotator");
  const mockup = section.querySelector("#delio-card-mockup");

  const frontImg = section.querySelector("#delio-card-front-img");
  const backImg = section.querySelector("#delio-card-back-img");
  const mockupImg = section.querySelector("#delio-card-mockup-img");

  const number = section.querySelector("#delio-cards-number");
  const title = section.querySelector("#delio-cards-title");
  const description = section.querySelector("#delio-cards-description");
  const zoom = section.querySelector("#delio-cards-zoom");

  if (
    !floating || !rotator || !mockup ||
    !frontImg || !backImg || !mockupImg ||
    !number || !title || !description || !zoom ||
    buttons.length !== 3
  ) {
    console.warn("Faltan elementos de las tarjetas de Delio.");
    return;
  }

  section.dataset.initialized = "true";

  const views = {
    frente: {
      number: "01 / 03",
      title: "Diseño frontal",
      description:
        "Logotipo principal y elementos gráficos " +
        "de la identidad de Delio Smartphone.",
      image: frontImg
    },
    reverso: {
      number: "02 / 03",
      title: "Diseño posterior",
      description:
        "Información comercial y elementos de " +
        "identificación de la empresa.",
      image: backImg
    },
    mockup: {
      number: "03 / 03",
      title: "Presentación del mockup",
      description:
        "Visualización conceptual de las tarjetas impresas.",
      image: mockupImg
    }
  };

  let currentView = "frente";

  function showCard(id) {
    const view = views[id];
    if (!view) return;

    currentView = id;

    // Mostrar tarjetas o mockup
    const isMockup = id === "mockup";

    floating.hidden = isMockup;
    mockup.hidden = !isMockup;

    // Animación de giro
    rotator.classList.toggle(
      "is-flipped",
      id === "reverso"
    );

    // Actualizar información
    number.textContent = view.number;
    title.textContent = view.title;
    description.textContent = view.description;

    // Estado de los botones
    buttons.forEach(button => {
      const active = button.dataset.delioCard === id;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    zoom.setAttribute(
      "aria-label",
      "Ampliar " + view.title
    );
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      showCard(button.dataset.delioCard);
    });
  });

  // Ampliar la imagen seleccionada en otra pestaña
  zoom.addEventListener("click", () => {
    const selectedImage = views[currentView].image;
    window.open(selectedImage.src, "_blank", "noopener");
  });

  // Informar sobre archivos inexistentes
  [frontImg, backImg, mockupImg].forEach(img => {
    img.addEventListener("error", () => {
      console.error("No se encontró la imagen:", img.src);
    });

    if (img.complete && img.naturalWidth === 0) {
      console.error("No se encontró la imagen:", img.src);
    }
  });

  showCard("frente");
}

// Inicializar cuando el HTML esté disponible
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDelioCards);
} else {
  initDelioCards();
}


function navigate() {

  const hash = decodeURIComponent(
    location.hash.substring(1)
  );

  const portfolioMatch =
    /^portafolio\/(universitario|personal|trabajo)$/
    .exec(hash);

  const categoryMatch =
    /^area\/(grafico|video|editorial|ui)$/
    .exec(hash);

  const projectMatch =
    /^proyecto\/([a-z0-9-]+)$/
    .exec(hash);

  const inPortfolio = Boolean(portfolioMatch);
  const inCategory = Boolean(categoryMatch);

  const inOrderly = hash === "proyecto/orderly";
const inDelio = hash === "proyecto/delio-smartphone";

const inProject = Boolean(
  projectMatch &&
  proyectos[projectMatch[1]] &&
  !inOrderly &&
  !inDelio
);
  // VISIBILIDAD DE LAS VISTAS

home.hidden =
  inCategory || inProject || inOrderly || inDelio;

categoryView.hidden = !inCategory;
projectView.hidden = !inProject;

if (orderlyView) {
  orderlyView.hidden = !inOrderly;
}

if (delioView) {
  delioView.hidden = !inDelio;
}

  closeMenu();

  // VENTANAS DE PORTAFOLIO

  if (inPortfolio) {
if (delioView) delioView.hidden = true;
    home.hidden = false;
    categoryView.hidden = true;
    projectView.hidden = true;

    if (orderlyView) orderlyView.hidden = true;

    openPopup(portfolioMatch[1]);
    refreshHeader();
    return;
  }

  closePopup();

  // ÁREAS CREATIVAS

  if (inCategory) {

    renderCategory(categoryMatch[1]);
    window.scrollTo(0, 0);

  }

  // ORDERLY

  else if (inOrderly) {

    document.title =
      "ORDERLY | Caso de estudio UX/UI | ElaVisual";

    window.scrollTo(0, 0);

  }

  // FICHAS DE OTROS PROYECTOS
else if (inDelio) {

  document.title =
    "Delio Smartphone | Branding | ElaVisual";

  window.scrollTo(0, 0);

}
  else if (inProject) {

    if (
      !returnRoute.startsWith("#area/") &&
      !returnRoute.startsWith("#portafolio/")
    ) {
      returnRoute = "#proyectos";
    }

    renderProject(projectMatch[1]);
    window.scrollTo(0, 0);

  }

  // PÁGINA PRINCIPAL

  else {

    document.title =
      "ElaVisual | Portafolio Multimedia";

    requestAnimationFrame(() => {

      const target = hash
        ? document.getElementById(hash)
        : null;

      if (
        target &&
        home.contains(target)
      ) {

        target.scrollIntoView({
          block: "start",
          behavior: "auto"
        });

      } else {

        window.scrollTo(0, 0);

      }

      if (
        hash === "proyectos" &&
        previousFocus?.isConnected
      ) {
        previousFocus.focus({
          preventScroll: true
        });
      }

    });
  }

  refreshHeader();
}


  window.addEventListener("hashchange", navigate);

  /* ==========================================
     12. FILTROS DE CERTIFICACIONES
  ========================================== */

  const certCards = $$(".certificate-card");

  $$("#certificate-filters button").forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.certFilter;

      $$("#certificate-filters button").forEach(btn => {
        const active = btn === button;
        btn.classList.toggle("selected", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      let visible = 0;

      certCards.forEach(card => {
        const show = filter === "all" ||
          card.dataset.certCategory === filter;

        card.hidden = !show;
        if (show) visible++;
      });

      text(
        "#certifications-summary",
        "Mostrando " + visible +
        (visible === 1
          ? " certificación"
          : " certificaciones")
      );
    });
  });

  
/* ==========================================
   13. BOTONES VER CREDENCIAL
========================================== */

certCards.forEach(card => {
  const url = card.dataset.badgeUrl?.trim() || "";

  if (card.querySelector(".badge-button")) return;

  const boton = document.createElement("a");
  boton.className = "badge-button";
  boton.textContent = "Ver credencial ↗";

  let enlaceValido = false;

  try {
    const destino = new URL(url);

    if (["https:", "http:"].includes(destino.protocol)) {
      boton.href = destino.href;
      boton.target = "_blank";
      boton.rel = "noopener noreferrer";
      enlaceValido = true;
    }
  } catch (_) {}

  if (!enlaceValido) {
    boton.classList.add("badge-button--disabled");
    boton.setAttribute("aria-disabled", "true");
    boton.title = "Enlace pendiente de agregar";
  }

  const footer = card.querySelector(
    ".certificate-card__bottom"
  );

  if (footer) {
    footer.before(boton);
  } else {
    card.appendChild(boton);
  }
});


/* ==========================================
   CURSOR PERSONALIZADO - ELAVISUAL
========================================== */

function iniciarCursorElaVisual() {

  const cursor = document.getElementById(
    "elavisual-cursor"
  );

  if (!cursor) return;

  const mouseCompatible = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let x = -100;
  let y = -100;
  let visualX = -100;
  let visualY = -100;
  let animacion = null;

  function permitido() {
    return mouseCompatible.matches &&
      !movimientoReducido.matches &&
      !document.documentElement.classList.contains(
        "reduce-motion"
      );
  }

  function dibujar() {

    visualX += (x - visualX) * 0.22;
    visualY += (y - visualY) * 0.22;

    cursor.style.transform =
      `translate3d(${visualX}px, ${visualY}px, 0)`;

    if (
      Math.abs(x - visualX) > 0.1 ||
      Math.abs(y - visualY) > 0.1
    ) {
      animacion = requestAnimationFrame(dibujar);
    } else {
      animacion = null;
    }
  }

  function moverCursor(evento) {

    if (!permitido()) {
      cursor.style.opacity = "0";
      document.body.classList.remove(
        "elavisual-cursor-ready"
      );
      return;
    }

    x = evento.clientX;
    y = evento.clientY;

    cursor.style.opacity = "1";

    document.body.classList.add(
      "elavisual-cursor-ready"
    );

    if (animacion === null) {
      animacion = requestAnimationFrame(dibujar);
    }

    const interactivo = evento.target.closest(
      "a, button, input, textarea, select, " +
      "[role='button']"
    );

    cursor.classList.toggle(
      "cursor-hover",
      Boolean(interactivo)
    );
  }

  document.addEventListener(
    "pointermove",
    moverCursor,
    { passive: true }
  );

  document.addEventListener("pointerout", evento => {
    if (!evento.relatedTarget) {
      cursor.style.opacity = "0";
    }
  });

  window.addEventListener("blur", () => {
    cursor.style.opacity = "0";
  });

  function actualizarCursor() {
    if (!permitido()) {
      cursor.style.opacity = "0";
      document.body.classList.remove(
        "elavisual-cursor-ready"
      );
    }
  }

  mouseCompatible.addEventListener?.(
    "change", actualizarCursor
  );

  movimientoReducido.addEventListener?.(
    "change", actualizarCursor
  );

  document.getElementById("motion-button")
    ?.addEventListener(
      "click", actualizarCursor
    );
}

iniciarCursorElaVisual();



/* ==========================================
   DESPLAZAMIENTO INTERNO DE ORDERLY
========================================== */
$("#ord-scroll-screens")?.addEventListener("click", () => {
  const destino = $("#ord-pantallas");

  destino?.scrollIntoView({
    behavior: root.classList.contains("reduce-motion")
      ? "auto"
      : "smooth",
    block: "start"
  });
});

/* VISOR INTERACTIVO DE IMÁGENES */

const lightbox = $("#gallery-lightbox");

/* ==========================================
   14. INICIAR EL SITIO
========================================== */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

navigate();

if (!location.hash || location.hash === "#inicio") {
  window.scrollTo(0, 0);
}

})();


