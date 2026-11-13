# Biblioteca Comunitaria - Capilla Ntra. Sra. de Lourdes (Temperley)

Monolito web para la biblioteca comunitaria del barrio, desarrollado con **Go** (Backend REST + SQLite puro) y **React** (Frontend con Vite + Tailwind CSS + Lucide Icons), implementando fielmente el sistema de diseño **"Scriptorium & Mármol"** de Stitch.

---

## 📚 Características Principales

1. **Catálogo Abierto y Diverso**:
   - No está limitado a literatura eclesiástica: incluye **novelas**, **terror** (Stephen King, Lovecraft, Bram Stoker), **suspenso & policial** (Agatha Christie, Umberto Eco), **cuentos** (Borges, Cortázar, Quiroga), **clásicos universales** y **divulgación**.
   - Filtros instantáneos por género, búsqueda en tiempo real y selector de formato (Físico / PDF Digital).

2. **Flujo de Reserva y Pase QR Digital**:
   - Selección de turno de retiro (*Mañana 10:00 a 13:00 hs*, *Tarde 15:00 a 18:00 hs*, *Sábado 9:30 a 12:30 hs*).
   - Generación automática de código de retiro único (`RES-LOURDES-XXXX`) y credencial digital QR interactiva para presentar en el mostrador del atrio.
   - Posibilidad de imprimir el comprobante o visualizarlo desde el teléfono celular.

3. **Gestión de Préstamos e Historial**:
   - Control de préstamos a domicilio vigentes por 21 días.
   - Botón para solicitar prórrogas/renovaciones de 21 días adicionales (hasta 3 renovaciones).
   - Historial de libros devueltos con opción de volver a reservar.

4. **Cartelera Comunitaria & Noticias**:
   - Actividades del barrio, club de lectura de los jueves y campañas de donación de libros.
   - Horarios de secretaría parroquial y atención tras la Santa Misa dominical.

5. **Inscripción de Lectores Vecinales**:
   - Registro ágil para vecinos con generación inmediata de número de credencial de lector (`#GT-XXXX`).

---

## 🛠️ Arquitectura Monolítica

```text
bibliotecaWeb/
├── .agents/skills/       # Skills importadas (design-system, ui-styling, brand, etc.)
├── agents/skills/        # Copia espejo de skills
├── backend/              # Backend en Go
│   ├── cmd/server/       # Punto de entrada
│   ├── internal/
│   │   ├── database/     # SQLite puro (modernc.org/sqlite - sin dependencias CGO)
│   │   ├── handlers/     # Endpoints REST (books, reservations, loans, news, auth)
│   │   └── models/       # Modelos de dominio
│   ├── main.go           # Servidor HTTP + Serving de estáticos React
│   └── server.exe        # Binario compilado listo para ejecutar
├── frontend/             # Frontend React
│   ├── src/
│   │   ├── components/   # Sidebar, Header, CatalogoView, MisReservasView, HistorialView, NoticiasView, Modales
│   │   ├── api.js        # Cliente REST con Axios/Fetch
│   │   ├── App.jsx       # Coordinador de vistas y estado
│   │   └── index.css     # Tokens de diseño Scriptorium & Mármol
│   ├── dist/             # Build de producción optimizado servido por Go
│   └── package.json
└── stitch_assets/        # Diseños y plantillas extraídas vía StitchMCP
```

---

## 🚀 Cómo Ejecutar la Aplicación

### Modo Monolito (Producción - Todo en un solo comando)
El backend en Go ya tiene el build de React y la base de datos SQLite integrada:

```powershell
cd backend
.\server.exe
```
Abrí tu navegador en **http://localhost:8080**

### Modo Desarrollo (Hot-Reload)
Si deseás modificar el frontend o backend con recarga en vivo:

**Terminal 1 (Backend Go):**
```powershell
cd backend
go run main.go
```

**Terminal 2 (Frontend React):**
```powershell
cd frontend
npm run dev
```
Acceso a Vite en `http://localhost:5173`.
