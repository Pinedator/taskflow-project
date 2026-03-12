# Flujo de trabajo con Cursor

Aqui se documenta cómo se utiliza Cursor en el flujo de trabajo del protecto incluyendo ejemplos de integración, comandos y buenas practicas

## Atajos de teclado

Actualmente los atajos de teclado que mas utilizo serian Ctrl+I para utilizar Composer y Ctrl+k para utilizar edicion inline

## Mejoras en el codigo

He utilizado cursor como una herramienta para solucionar problemas y mejorar mi codigo.
### Primera modificación

En primer lugar le he pedidido que solucione un bug en el cual cuando pasabas por encima del boton de añadir salia una barra de desplazamiento en el inferior del bloque, en este caso me ha modificado 4 pedazos del index.html.
```bash
//antes
<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
//despues
<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col overflow-x-hidden">
```
```bash
//antes
class="bg-white dark:bg-gray-700 text gray-800 dark:text-gray-200 px-3 py-1 rounded-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">
//despues
class="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">

```
```bash
//antes
<div class="layout flex pt-20 px-4 gap-4 max-w-4xl mx-auto w-full flex-col md:flex-row items-start h-[calc(100vh-5rem)]">
//despues
<div class="layout flex pt-20 px-4 gap-4 max-w-4xl mx-auto w-full flex-col md:flex-row items-start h-[calc(100vh-5rem)] overflow-x-hidden">
```
```bash
//antes
<button type="submit"
                    class="bg-indigo-700 dark:bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">
//despues
<button type="submit"
					class="bg-indigo-700 dark:bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold transition hover:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
```

### Segunda modificacion
En esta segunda modificacion se ha mejorado el feedback de la funcion delete task 
```bash
//antes

function deleteTask(id) {
     tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks(tasks);
}
//despues

function deleteTask(id) {
const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    // Opcional: animación/feedback antes de eliminar
    const li = document.querySelector(`li[data-id='${id}']`);
    if (li) {
      li.classList.add("opacity-50", "line-through");
      setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(tasks);
      }, 200); // Espera 200ms para mostrar animación
    } else {
      // Si no se encuentra el elemento visual, elimina directamente
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(tasks);
    }
  }
}
```

## Servidor MCP

En este apartado explicare como he instalado el servidor MCP en este ejemplo sera el servidor MCP de github de forma remota lo explicare paso a paso y luego dare una pequeña conclusión
```bash
1- Acceder a la pagina de github y buscar el repositorio oficial de github-mcp-server  https://github.com/github/github-mcp-server.

2- En el readme del proyecto busca la guia de instalación que necesites en mi caso necesitaba la guia para cursor

3- En la guia de instalacion en el apartado remoto github utiliza un hosted server y tiene un enlaze que añade automaticamente las configuraciones a cursor

4- Si no tienes un token de acceso de github tienes que generara uno te va a Github -> Settings -> Developer Settings -> Personal access token -> Fine grained tokens y le haces click a generate new token.

5- En cursor te saldra un cuadro de instalacion y tienes que cambiar en el header el token de instalacion que por defercto pone YOUR_GITHUB_PAT y ahi pegas tu token de acceso personal.

6- Pulsas en install y se te aplican los ajustes automaticamente y tendrias ya el MCP instalado en cursor
```

Como conclusion considero que es una herramienta muy util que agiliza la recopilacion de informacion gracias a la ia en el caso del MCP de Github destaca en mi opinion su capacidad de leer los repositorios para comprender un contexto general del proyecto y proponga cambio y sobre todo la capacidad de crear pull request. Tambien me parece util en el punto de eacceso a bases de datos pues ayuda a hacer consultas complejas sin necesidad de conocer mucho sobre las bases de datos por ejemplo en SQL para hacer consultas de analiticas o reportes especificos.


