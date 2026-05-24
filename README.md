# GlutenFree Santiago 🇨🇱

Una aplicación web moderna diseñada para ayudar a la comunidad celíaca y a personas que buscan opciones libres de gluten en Santiago de Chile. Encuentra restaurantes seguros, visualiza rutas y obtén información de contacto de forma rápida y sencilla.

## 🚀 Características

- **Mapa Interactivo:** Visualización de restaurantes con marcadores diferenciados:
  - 🟢 **Verde:** 100% Sin Gluten.
  - 🔵 **Azul:** Opciones Sin Gluten disponibles.
- **Búsqueda Inteligente:** Encuentra tu ubicación actual ingresando calle y número.
- **Rutas y Tiempos:** Cálculo automático de la mejor ruta desde tu ubicación seleccionada hacia cualquier restaurante.
  - 🚗 Tiempo estimado en automóvil.
  - 🚶 Tiempo estimado caminando (basado en perfiles reales de peatón).
- **Vista de Listado:** Listado alfabético completo con detalles de contacto y tipo de menú.
- **Filtros Rápidos:** Alterna fácilmente entre ver todos los lugares, solo los 100% libres de gluten o aquellos con opciones parciales.
- **Acciones Directas:** Botón de llamada integrado en los detalles de cada restaurante.
- **Diseño Moderno:** Interfaz adaptable con soporte nativo para **Modo Oscuro**.

## 🛠️ Tecnologías Utilizadas

- **Framework:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Herramienta de Construcción:** [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Mapas:** [Leaflet](https://leafletjs.com/) y [React-Leaflet](https://react-leaflet.js.org/)
- **Motor de Rutas:** [Leaflet Routing Machine](http://www.liedman.net/leaflet-routing-machine/) y OSRM
- **Iconos:** [Lucide React](https://lucide.dev/)

## 📦 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/leacar21/glutenfree-santiago.git
    cd glutenfree-santiago
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar en modo desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Generar versión de producción:**
    ```bash
    npm run build
    ```

## 📄 Licencia

Este proyecto fue desarrollado para la comunidad. Siéntete libre de usarlo y mejorarlo.

---
Hecho con ❤️ para la comunidad celíaca de Santiago.
