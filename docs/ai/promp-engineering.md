# Ingenieria de Prompts 

Este documento contendrá las prácticas y estrategias para diseñar prompts efectivos que obtengan resultados optimos de los modelos de IA

He buscado prompts utiles y estos son lo que mas me han ayudado
## Prompts

### Prompt 1 
 Few-Shot Prompting: Generar tests unitarios
Ayuda para especificarle a la ia los formatos exactos que quiero y los ejemplos ayudan mas que mucho texto.
### Prompt 2 
 Restricciones Claras
    especificarele cosas como el maximo de lineas que el codigo sea autoexplicativo ayuda par que el modelo no rellene cosas de mas y se salga de las prefeerencias de un proyecto
### Prompt 3 
 cadena de pensamiento
    pedirle que razone cada cosa y especificarle el que tener en cuenta ayuda a mantener el orden y condimero que da codigos mas optimos y sin tanta redundancia
### Prompt 4 
 Rol
    pedirle que actue como alguien experto en refactorizar por ejemplo ayuda a que los refractors no rompan el funcionamiento ya establecido en el proyecto
### Prompt 5 
 Debug 
    clarificarle un bug en el codigo y pedirque que te explique lo que causa el error porque pasa y cual es el fix minimo ayuda a entender el error y da una solucion sin afectar mucho al codigo
### Prompt 6 
 ser especifico
    ser especifico en lo maximo posible ayuda a que el codigo cumpla con lo que pido en mayor parte, por ejemplo especificar el contexto tecnologico.
### Prompt 7 
 Arquitectura
    pedirle que actue como una arquitecto de software explicando el sistema a una nuevo integrante del equipo y limitale las palabras facilita el entendimiento completo del codigo
### Prompt 8 
 Revisiones del codigo
    pedirle que solo señale problemas reales (bugs, seguridad, rendimiento) y que ignore preferencias de estilo evita que el modelo rellene la respuesta con sugerencias subjetivas que no aportan valor real.
### Prompt 9 
 Datos de prueba
    pedirle casos borde explícitamente (nulls, strings vacíos, valores extremos) hace que los fixtures sean útiles de verdad. Sin esa instrucción genera datos todos iguales y los bugs suelen estar justo en los casos raros.
### Prompt 10 
 Migración de dependencias
    pedirle que avise antes de cambiar si hay diferencias de comportamiento entre librerías protege contra bugs silenciosos. Sin esa restricción el modelo migra directamente aunque las dos librerías no se comporten igual en todos los casos.
