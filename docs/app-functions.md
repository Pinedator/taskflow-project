# Referencia de funciones (`app.js`)

Este documento describe las funciones principales de la ToDoList WebApp y cómo se conectan entre sí.

## Flujo general

- Al cargar la página (`DOMContentLoaded`):
  - `initTheme()` aplica el tema guardado.
  - `initTasks()` carga tareas desde LocalStorage y renderiza.
  - `initEvents()` registra los listeners de UI.

- Cada acción del usuario actualiza el estado en memoria (`tasks`, filtros/búsqueda), persiste en LocalStorage (cuando aplica) y vuelve a renderizar.

## Estado en memoria

- `tasks`: array con el modelo `{ id, text, completed }`.
- `searchQuery`: string (lo que hay en el input de búsqueda).
- `statusFilter`: `"all" | "pending" | "completed"`.

## Funciones de inicialización

### `initTheme()`

- **Responsabilidad**: lee `theme` desde LocalStorage y activa/desactiva la clase `dark` en el `<html>`.
- **Efecto**: cambia el modo visual al iniciar.

### `initTasks()`

- **Responsabilidad**: carga `tasks` desde LocalStorage usando `loadTasksFromStorage()` y llama a `renderTasks(...)`.
- **Efecto**: restaura las tareas al iniciar.

### `initEvents()`

- **Responsabilidad**: enlaza eventos del DOM con sus handlers.
- **Incluye**:
  - toggle de tema
  - submit del formulario
  - input de búsqueda
  - delegación de clicks en la lista de tareas
  - botones de filtro
  - acciones masivas

## Handlers (eventos)

### `handleThemeToggle()`

- **Evento**: click en `#theme-toggle`.
- **Responsabilidad**: alterna el modo oscuro y guarda `"dark"`/`"light"` en LocalStorage.

### `handleFormSubmit(event)`

- **Evento**: submit del formulario `#task-form`.
- **Responsabilidad**: valida el texto y llama a `addTask(text)`.
- **Parámetros**:
  - `event`: `Event`

### `handleSearchInput()`

- **Evento**: input en `#search-input`.
- **Responsabilidad**: actualiza `searchQuery` y vuelve a pintar la lista usando `getVisibleTasks()`.

### `handleTaskListClick(event)`

- **Evento**: click dentro de `#task-list` (delegación).
- **Responsabilidad**: ejecuta acciones por tarea según `data-action`:
  - `delete`
  - `toggle-completed`
  - `edit`

## Funciones de negocio (tareas)

### `getVisibleTasks()`

- **Responsabilidad**: devuelve la lista filtrada por:
  - texto (`searchQuery`)
  - estado (`statusFilter`)
- **Devuelve**: `Array<Task>`

### `setStatusFilter(filter)`

- **Responsabilidad**: actualiza `statusFilter` y vuelve a renderizar con `getVisibleTasks()`.
- **Parámetros**:
  - `filter`: `"all" | "pending" | "completed"`

### `addTask(text)`

- **Responsabilidad**: crea una tarea nueva (por defecto `completed: false`), la añade a `tasks`, guarda y re-renderiza.
- **Parámetros**:
  - `text`: `string`

### `renderTasks(taskArray)`

- **Responsabilidad**: renderiza `taskArray` en el DOM (`#task-list`) creando los `<li>` y los botones por tarea.
- **Parámetros**:
  - `taskArray`: `Array<Task>`

### `deleteTask(id)`

- **Responsabilidad**: elimina una tarea por `id`, guarda y re-renderiza.
- **Parámetros**:
  - `id`: `number`

### `toggleTaskCompleted(id)`

- **Responsabilidad**: alterna `completed` para una tarea, guarda y re-renderiza.
- **Parámetros**:
  - `id`: `number`

### `editTask(id, newText)`

- **Responsabilidad**: actualiza el `text` de una tarea, guarda y re-renderiza.
- **Parámetros**:
  - `id`: `number`
  - `newText`: `string`

### `handleCompleteAll()`

- **Responsabilidad**: marca todas las tareas como completadas, guarda y re-renderiza.

### `handleClearCompleted()`

- **Responsabilidad**: elimina todas las tareas completadas, guarda y re-renderiza.

## Persistencia (LocalStorage)

### `loadThemeFromStorage()`

- **Lee**: `theme` (string | null)

### `saveThemeToStorage(theme)`

- **Escribe**: `theme`

### `loadTasksFromStorage()`

- **Lee**: `tasks`
- **Nota**: normaliza el campo `completed` a boolean.

### `saveTasksToStorage(tasksToSave)`

- **Escribe**: `tasks` como JSON.

### `saveTasks()`

- **Responsabilidad**: persiste el array `tasks` actual.

## Tipos (conceptual)

```ts
type Task = {
  id: number;
  text: string;
  completed: boolean;
};
```

