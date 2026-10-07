# Frontend - Sistema de Planificación de Vendimia (Viña Concha y Toro)

Este directorio contiene el código fuente correspondiente a la capa de presentación (Frontend) del Sistema de Apoyo a la Toma de Decisiones (DSS) para la programación logística de patio y vendimia.

La interfaz proporciona a los usuarios operativos las herramientas visuales para la carga estructurada de archivos logísticos, la gestión del estado de la maquinaria y la visualización de los cronogramas generados por el motor de optimización matemática.

---

## Stack Tecnológico

- **Framework Core:** React 18 (Inicializado vía Create React App).
- **Enrutamiento:** React Router DOM v6.
- **Librerías de Interfaz de Usuario:** Material-UI (MUI v4) y Bootstrap 5.
- **Cliente HTTP:** Axios.
- **Procesamiento de Documentos:** `pdfjs-dist`, `xlsx`, `@react-pdf-viewer/core`.

---

## Requisitos Previos

- **Entorno de ejecución:** Node.js (Se requiere versión v16 o v18 LTS para evitar conflictos de compatibilidad con librerías legacy).
- **Gestor de dependencias:** `npm` (incluido nativamente con Node.js).
- **Servicio Backend:** El orquestador de Django debe encontrarse en ejecución para que la aplicación web pueda resolver correctamente las llamadas a la API.

---

## Instrucciones de Despliegue en Entorno Local

Siga los pasos detallados a continuación para aprovisionar e inicializar la interfaz de usuario en un entorno de desarrollo:

### 1. Configuración de Variables de Entorno
El aplicativo requiere la definición del endpoint base para la resolución de peticiones HTTP. En el directorio raíz de este módulo (`/frontend`), verifique o genere el archivo `.env` con la siguiente asignación estática:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 2. Instalación de Dependencias
A través de su intérprete de comandos, ejecute el gestor de paquetes para descargar e integrar las dependencias declaradas en el manifiesto `package.json`.

```bash
npm install
```

### 3. Inicialización del Servidor de Desarrollo
Arranque el servidor de desarrollo local de React. Este comando compilará los módulos en tiempo real y expondrá el servicio localmente.

```bash
npm start
```
*Por defecto, la interfaz quedará disponible para consumo en http://localhost:3000.*

---

## Compilación para Entornos Productivos

Para generar el empaquetado estático optimizado, requisito para despliegues en servidores web estándar (Nginx, Apache) o servicios de almacenamiento en la nube (AWS S3, Azure Blob, etc.), ejecute:

```bash
npm run build
```
Este proceso orquestará la transpilación y generará un directorio `build/` con los *assets* estáticos minificados.

---

## Arquitectura y Lógica de Comunicación

1. **Flujo de Peticiones:** Todo componente que requiera transaccionar datos con el servidor o consultar estados, instancia un cliente asíncrono (`axios`) apuntando hacia la ruta resuelta por la variable `process.env.REACT_APP_BACKEND_URL`.
2. **Estructura de Directorios Base:**
   - `src/index.js`: Punto de montaje lógico e inicialización de la jerarquía de React.
   - `src/App.js`: Declaración del árbol de rutas de navegación.
   - `src/components/`: Directorio de componentes modulares de interfaz gráfica.
   - `src/pages/`: Estructuras de vistas completas asociadas a las rutas del aplicativo.
