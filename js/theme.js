const htmlEl = document.documentElement;
const btnTema = document.getElementById("btn-tema");

// 1. Al cargar la página, aplica el tema guardado previamente
const temaGuardado = localStorage.getItem("tema-autovip") || "light";
aplicarTema(temaGuardado);

function aplicarTema(tema) {
  htmlEl.setAttribute("data-bs-theme", tema);
  if (btnTema) {
    btnTema.innerHTML =
      tema === "dark"
        ? '<i class="fas fa-sun text-warning"></i>'
        : '<i class="fas fa-moon"></i>';
  }
}

// 2. Alterna entre claro y oscuro al hacer clic
if (btnTema) {
  btnTema.addEventListener("click", () => {
    const nuevoTema =
      htmlEl.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("tema-autovip", nuevoTema);
    aplicarTema(nuevoTema);
  });
}
