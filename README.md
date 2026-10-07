# Frontend - Sistema de Planificación de Vendimia (Viña Concha y Toro)

Este directorio contiene el código fuente correspondiente al **Frontend** del Sistema de Apoyo a la Toma de Decisiones (DSS) para la programación logística de patio y vendimia.

La interfaz proporciona a los usuarios las herramientas visuales para cargar los archivos logísticos (PDF y Excel), gestionar el estado de las máquinas y visualizar los cronogramas generados por el modelo de optimización.

---

## 🛠️ Stack Tecnológico

- **Librería Core:** React 18 (Inicializado vía Create React App).
- **Enrutamiento:** React Router DOM v6.
- **Librerías de UI:** Material-UI (MUI v4) y Bootstrap 5.
- **Cliente HTTP:** Axios.
- **Manejo de Documentos:** `pdfjs-dist`, `xlsx`, y componentes de renderizado PDF.

---

## ⚙️ Requisitos Previos

- **Entorno de ejecución:** [Node.js](https://nodejs.org/) (Se recomienda versión v16 o v18 LTS).
- **Gestor de paquetes:** `npm` (incluido con Node.js).
- **Servicio Backend:** El backend de Django debe estar ejecutándose localmente para que la aplicación web pueda consumir la API.

---

## 🚀 Instrucciones de Despliegue Local

Siga los siguientes pasos para inicializar la interfaz de usuario en su máquina local:

### 1. Configuración de Variables de Entorno
El frontend necesita saber a qué dirección apuntar para comunicarse con la API. En el directorio raíz del frontend (`/frontend`), asegúrese de contar con un archivo `.env` que contenga la siguiente variable:

```env
# URL del backend local (Puerto 8000 por defecto en Django)
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 2. Instalación de Dependencias
Abra su terminal en la carpeta `frontend` y ejecute el gestor de paquetes para descargar todas las dependencias listadas en el `package.json`.

```bash
npm install
```

### 3. Ejecución del Servidor de Desarrollo
Una vez finalizada la instalación, inicie el servidor de React en modo desarrollo.

```bash
npm start
```
*El aplicativo abrirá automáticamente una pestaña en su navegador apuntando a [http://localhost:3000](http://localhost:3000).*

---

## 📦 Compilación para Producción

Si desea generar los archivos estáticos optimizados para montar la aplicación en un servidor web (Nginx, Apache, AWS S3, etc.), ejecute:

```bash
npm run build
```
Esto generará una carpeta `build/` con el empaquetado minificado y listo para el entorno productivo.

---

## 🧠 Arquitectura de Comunicación

1. **Flujo de Peticiones:** Todo componente que requiera datos del servidor utiliza el cliente `axios` para hacer peticiones HTTP hacia la ruta definida en `process.env.REACT_APP_BACKEND_URL`.
2. **Archivos Base:**
   - `src/index.js`: Punto de entrada de la aplicación.
   - `src/App.js`: Declaración del enrutador y estructura base de la web.
   - `src/components/`: Piezas de interfaz de usuario aisladas y reutilizables.
   - `src/pages/`: Vistas completas a las que el usuario puede navegar.
