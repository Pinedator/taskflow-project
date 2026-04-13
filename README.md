# Taskflow Project (ToDoList WebApp)

Aplicación web de gestión de tareas con frontend en JavaScript Vanilla y backend REST en Node.js. Las tareas se almacenan en el servidor y se sincronizan en tiempo real mediante peticiones HTTP asíncronas.

## Qué incluye

- **UI**: `index.html` (Tailwind vía CDN)
- **Lógica**: `app.js` (JavaScript Vanilla con módulos ES)
- **Capa de red**: `network/client.js` (comunicación con la API)
- **Estilos extra**: `styles.css`
- **Backend**: `server/` (Node.js + Express)
- **Documentación**: `docs/`

## Tecnologías

- HTML
- CSS
- JavaScript Vanilla (módulos ES)
- Tailwind CSS (CDN)
- Node.js
- Express
- dotenv
- cors
- nodemon

## Funcionalidades

- **Crear tareas**
- **Editar tareas**
- **Eliminar tareas**
- **Marcar tarea como completada / pendiente**
- **Búsqueda** por texto
- **Filtros**: ver **todas**, **pendientes** o **completadas**
- **Ordenación**: por **fecha de creación** o **alfabéticamente**
- **Acciones masivas**:
  - marcar **todas** como completadas
  - borrar **todas** las completadas
- **Persistencia**: las tareas se guardan en el servidor
- **Modo claro/oscuro**
- **Estados de red**: indicadores de carga y error en todas las operaciones

## Cómo ejecutar en local

**Backend** — arranca el servidor primero:

```bash
cd server
npm install
npm run dev
```

Servidor disponible en `http://localhost:3000`.

**Frontend** — abre `index.html` con "Open with Live Server" desde VS Code.

> Para trabajar en local cambia la URL en `network/client.js`:
> ```js
> const API_URL = 'http://localhost:3000/api/v1/tasks';
> ```

## Despliegue

- **Frontend**: [taskflow-project-red.vercel.app](https://taskflow-project-red.vercel.app)
- **Backend**: [taskflow-server-kappa.vercel.app](https://taskflow-server-kappa.vercel.app)

## Estructura del proyecto

```text
taskflow-project/
  index.html
  app.js
  styles.css
  vercel.json
  README.md
  network/
    client.js
  server/
    src/
      index.js
      config/
        env.js
      routes/
        task.routes.js
      controllers/
        task.controller.js
      services/
        task.service.js
    .env
    .gitignore
    vercel.json
    package.json
  docs/
```

## Modelo de datos

Las tareas se almacenan en memoria en el servidor con la siguiente estructura:

- `id`: number (timestamp)
- `text`: string
- `completed`: boolean

La preferencia de tema claro/oscuro se guarda en **LocalStorage** del navegador:

- **Clave `theme`**: `"dark"` | `"light"`

## Documentación técnica del servidor

La referencia completa de endpoints, middlewares y arquitectura está en:

- `server/README.md`
