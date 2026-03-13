# Taskflow Project (ToDoList WebApp)

Aplicación web **sin backend** para gestionar tareas en el navegador. Guarda el estado en **LocalStorage**, incluye **modo oscuro**, **búsqueda**, **filtros por estado** y acciones masivas.

## Qué incluye

- **UI**: `index.html` (Tailwind vía CDN)
- **Lógica**: `app.js` (JavaScript Vanilla)
- **Estilos extra**: `styles.css` (si aplica en tu versión)
- **Documentación**: `docs/`

## Tecnologías

- HTML
- CSS
- JavaScript (Vanilla)
- Tailwind CSS (CDN)
- LocalStorage

## Funcionalidades

- **Crear tareas**
- **Editar tareas**
- **Eliminar tareas**
- **Marcar tarea como completada / pendiente**
- **Búsqueda** por texto
- **Filtros**: ver **todas**, **pendientes** o **completadas**
- **Acciones masivas**:
  - marcar **todas** como completadas
  - borrar **todas** las completadas
- **Persistencia**: se conserva al recargar la página
- **Modo claro/oscuro**

## Cómo ejecutar

No requiere instalación.

- Abre `index.html` con doble clic, o con “Open with Live Server” (VSCode/Cursor).
- La app funciona completamente en el navegador.

## Estructura del proyecto

```text
taskflow-project/
  index.html
  app.js
  styles.css
  README.md
  docs/
```

## Modelo de datos (LocalStorage)

- **Clave `tasks`**: lista de tareas
  - `id`: number
  - `text`: string
  - `completed`: boolean
- **Clave `theme`**: `"dark"` | `"light"`

## Documentación de funciones

La referencia completa de funciones está en:

- `docs/app-functions.md`