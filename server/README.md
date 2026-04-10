# Taskflow — Server

API REST construida con Node.js y Express que gestiona las tareas de la aplicación Taskflow.

## Tecnologías

- **Node.js** — entorno de ejecución de JavaScript en el servidor
- **Express** — framework HTTP para Node.js
- **dotenv** — carga de variables de entorno desde `.env`
- **cors** — middleware para permitir peticiones desde el frontend
- **nodemon** — recarga automática del servidor en desarrollo

## Arquitectura de carpetas
server/
├── src/
│   ├── index.js              # Punto de entrada. Monta middlewares y rutas
│   ├── config/
│   │   └── env.js            # Carga y valida las variables de entorno
│   ├── routes/
│   │   └── task.routes.js    # Define los verbos HTTP y los conecta a los controladores
│   ├── controllers/
│   │   └── task.controller.js # Valida los datos de entrada y genera la respuesta HTTP
│   └── services/
│       └── task.service.js   # Lógica de negocio pura. Gestiona el array de tareas
├── .env                      # Variables de entorno (no se sube al repositorio)
├── .gitignore
├── vercel.json               # Configuración de despliegue en Vercel
└── package.json

## Arquitectura por capas

El servidor sigue una arquitectura de tres capas con responsabilidades separadas:

**Routes** — reciben la petición HTTP y la dirigen al controlador correcto según el verbo y la URL. No contienen lógica.

**Controllers** — extraen los datos de `req.body` y `req.params`, aplican validaciones defensivas y devuelven la respuesta HTTP con el código de estado adecuado. Si ocurre un error inesperado lo pasan al middleware global con `next(error)`.

**Services** — contienen la lógica de negocio pura. No saben nada de HTTP. Si algo falla lanzan un error estándar de JavaScript (`throw new Error`) que el controlador captura y traduce a un código HTTP.

## Middlewares

### `cors()`
Añade las cabeceras HTTP necesarias para que el navegador permita peticiones desde un dominio distinto al del servidor (Cross-Origin Resource Sharing). Sin este middleware el navegador bloquearía todas las peticiones del frontend.

### `express.json()`
Parsea el cuerpo de las peticiones entrantes con `Content-Type: application/json` y lo hace disponible en `req.body`. Sin él `req.body` sería `undefined`.

### Middleware global de errores
Función de 4 parámetros `(err, req, res, next)` registrada al final de `index.js`. Express la reconoce como middleware de errores por la firma de 4 parámetros. Centraliza el manejo de excepciones: traduce `NOT_FOUND` a HTTP 404 y cualquier otro error no controlado a HTTP 500, evitando que detalles técnicos internos lleguen al cliente.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT`   | Puerto donde escucha el servidor | `3000` |

## Entornos

**Producción** — `client.js` apunta al servidor desplegado en Vercel:
```js
const API_URL = 'https://taskflow-server-kappa.vercel.app/api/v1/tasks';
```

**Local** — cambia la URL en `network/client.js` a:
```js
const API_URL = 'http://localhost:3000/api/v1/tasks';
```
Y arranca el servidor con `npm run dev`.

## Endpoints

### GET /api/v1/tasks
Devuelve todas las tareas.

**Respuesta exitosa — 200**
```json
[
  {
    "id": 1712345678901,
    "text": "Comprar leche",
    "completed": false
  }
]
```

---

### POST /api/v1/tasks
Crea una nueva tarea.

**Body**
```json
{
  "text": "Comprar leche"
}
```

**Respuesta exitosa — 201**
```json
{
  "id": 1712345678901,
  "text": "Comprar leche",
  "completed": false
}
```

**Error — 400** (text vacío o ausente)
```json
{
  "error": "El campo text es obligatorio y no puede estar vacío"
}
```

---

### DELETE /api/v1/tasks/:id
Elimina una tarea por id.

**Ejemplo**
DELETE /api/v1/tasks/1712345678901

**Respuesta exitosa — 204**
Sin cuerpo.

**Error — 404** (id no existe)
```json
{
  "error": "Recurso no encontrado"
}
```

**Error — 400** (id no es un número)
```json
{
  "error": "El id debe ser un número válido"
}
```

---

### PATCH /api/v1/tasks/:id/toggle
Cambia el estado `completed` de una tarea.

**Ejemplo**
PATCH /api/v1/tasks/1712345678901/toggle

**Respuesta exitosa — 200**
```json
{
  "id": 1712345678901,
  "text": "Comprar leche",
  "completed": true
}
```

---

### PATCH /api/v1/tasks/:id
Edita el texto de una tarea.

**Body**
```json
{
  "text": "Comprar pan"
}
```

**Respuesta exitosa — 200**
```json
{
  "id": 1712345678901,
  "text": "Comprar pan",
  "completed": false
}
```

## Códigos HTTP utilizados

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | Petición correcta con datos que devolver |
| 201 | Created | Recurso creado correctamente |
| 204 | No Content | Operación correcta sin datos que devolver |
| 400 | Bad Request | Datos de entrada incorrectos o ausentes |
| 404 | Not Found | El recurso solicitado no existe |
| 500 | Internal Server Error | Error inesperado en el servidor |