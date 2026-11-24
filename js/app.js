const app = new Vue({
  el: "#ventas",
  data: {
    tipoCambio: null,
    anios: [],
    marcas: [],
    modelos: [],
    autos: [],
    cargando: true,
    anioSeleccionado: "",
    marcaSeleccionada: "",
    modeloSeleccionado: "",
    estadoSeleccionado: "",
    enDolares: true,
    autoSeleccionado: null,
    autoCopiadoId: null,
  },
  created: function () {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= 1900; i--) {
      this.anios.push(i);
    }

    fetch("https://ha-front-api-proyecto-final.vercel.app/rates")
      .then((res) => res.json())
      .then((datos) => {
        this.tipoCambio = datos.uyu;
      });

    fetch("https://ha-front-api-proyecto-final.vercel.app/brands")
      .then((res) => res.json())
      .then((datos) => {
        this.marcas = datos;
      });

    // Detecta si el usuario entró desde "Venta 0km" (?status=1) o "Venta Usados" (?status=0)
    const paramsUrl = new URLSearchParams(window.location.search);
    const statusInicial = paramsUrl.get("status");

    if (statusInicial === "1" || statusInicial === "0") {
      this.estadoSeleccionado = statusInicial;
      this.filtrarAutos();
    } else {
      fetch("https://ha-front-api-proyecto-final.vercel.app/cars")
        .then((res) => res.json())
        .then((datos) => {
          this.autos = datos;
          this.cargando = false;
        })
        .catch((error) => {
          console.error("Error al cargar autos:", error);
          this.cargando = false;
        });
    }
  },
  methods: {
    obtenerModelos: function () {
      this.modeloSeleccionado = "";
      this.modelos = [];

      if (this.marcaSeleccionada === "") {
        return;
      }

      fetch(
        `https://ha-front-api-proyecto-final.vercel.app/models?brand=${this.marcaSeleccionada}`,
      )
        .then((res) => res.json())
        .then((datos) => {
          this.modelos = datos;
        });
    },

    filtrarAutos: function () {
      this.cargando = true;
      const parametros = new URLSearchParams();

      if (this.anioSeleccionado !== "") {
        parametros.append("year", this.anioSeleccionado);
      }
      if (this.marcaSeleccionada !== "") {
        parametros.append("brand", this.marcaSeleccionada);
      }
      if (this.modeloSeleccionado !== "") {
        parametros.append("model", this.modeloSeleccionado);
      }
      if (this.estadoSeleccionado !== "") {
        parametros.append("status", this.estadoSeleccionado);
      }

      fetch(
        `https://ha-front-api-proyecto-final.vercel.app/cars?${parametros.toString()}`,
      )
        .then((res) => res.json())
        .then((datos) => {
          this.autos = datos;
          this.cargando = false;
        })
        .catch(() => {
          this.cargando = false;
        });
    },

    limpiarFiltros: function () {
      this.anioSeleccionado = "";
      this.marcaSeleccionada = "";
      this.modeloSeleccionado = "";
      this.estadoSeleccionado = "";
      this.modelos = [];
      this.filtrarAutos();
    },

    cambiarMoneda: function () {
      this.enDolares = !this.enDolares;
    },

    formatearPrecio: function (precioUsd) {
      if (this.enDolares || !this.tipoCambio) {
        return "USD " + precioUsd.toLocaleString("es-UY");
      }
      const enPesos = Math.round(precioUsd * this.tipoCambio);
      return "UYU " + enPesos.toLocaleString("es-UY");
    },

    verDetalle: function (auto) {
      this.autoSeleccionado = auto;
      const modalEl = document.getElementById("detalle-auto-modal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    },

    compartirAuto: function (auto) {
      const texto = `${auto.brand} ${auto.model} (${auto.year}) - ${window.location.href}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(texto);
      }
      this.autoCopiadoId = auto.id;
      setTimeout(() => {
        this.autoCopiadoId = null;
      }, 2000);
    },
  },
});
