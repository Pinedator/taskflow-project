# Flujo de trabajo con Cursor

Aqui se documenta cómo se utiliza Cursor en el flujo de trabajo del protecto incluyendo ejemplos de integración, comandos y buenas practicas

## Atajos de teclado

Actualmente los atajos de teclado que mas utilizo serian Ctrl+I para utilizar Composer y Ctrl+k para utilizar edicion inline

## Mejoras en el codigo

He utilizado cursor como una herramienta para solucionar problemas y mejorar mi codigo.
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