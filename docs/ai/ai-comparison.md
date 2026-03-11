# Comparacion de IA

Aqui se va a documentar la comparación entre distintas inteligencias artificiales, incluyendo ventajas desventajas casos de uso y rendimiento.

## Primera prueba
He realizado que los asistentes me explquen 3 conceptos técnicos distintos en mi caso han sido DOM, hoisting y event loop. La prueba ha sido realizada con ChatGPT y Claude.
En la prueba he llegado a la conclusion de que en terminos de eficiencia Claude se toma mas tiempo para procesar las respuestas pero a cambio me parece que sus respuestas son mucho mas claras que las de ChatGPT y profundizan mas en el concepto con ejemplos mas claros

### Ejemplo-ChatGPT
```bash
console.log("Inicio");

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("Fin");
```
¿Qué se imprime?
Inicio
Fin
Timeout

### Ejemplo-Claude
```bash
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```
**Resultado:** `1 → 4 → 3 → 2`

## Segunda prueba

Voy a escribir 3 funciones JavaScript con errores intencionales y pedirle ambos asistentes que detecten y expliquen el bug

### funcion 1
```bash
function calcularDescuento(precio, porcentaje) {
    let descuento = precio * porcentaje / 100;
    return descuento;
}
```
ChatGPT
```bash
El código no tiene un error de sintaxis, pero sí tiene un bug lógico común dependiendo de lo que se espera que haga la función.
La función no devuelve el precio con descuento, sino que devuelve solo el monto del descuento.
El "bug" no es técnico sino de lógica/expectativa:
La función devuelve el monto descontado, no el precio final.
```
Claude
```bash
Bug detectado
El código en sí calcula el descuento correctamente, pero devuelve el valor del descuento en lugar del precio final con el descuento aplicado. Dependiendo del uso esperado, esto puede ser un bug lógico.
Sin embargo, hay un bug más probable si el objetivo es devolver el precio final:

Bugs adicionales a considerar
porcentaje mayor a 100calcularDescuento(100, 150) → precio negativo Validar rango 0-100
Valores negativos calcularDescuento(-50, 20) Validar que precio > 0
Parámetros no numéricos calcularDescuento("cien", 20) → NaN Validar tipos
```

### funcion 2
```bash
function contarVocales(texto) {
    let count = 0;
    const vocales = "bcdfg"; // 
    for (let i = 0; i < texto.length; i++) {
        if (vocales.includes(texto[i].toLowerCase())) count++;
    }
    return count;
}
```
ChatGPT
```bash
Es un bug lógico por datos incorrectos, no de sintaxis ni estructura.

La lógica funciona bien:

Recorre el texto ✔

Convierte a minúscula ✔

Usa .includes() correctamente ✔

El problema es el contenido de la constante.
```
Claude
```bash
La variable se llama vocales pero contiene consonantes, por lo que la función nunca contará vocales reales y devolverá conteos completamente incorrectos.

Bugs adicionales a considerar
  Vocales con tilde "canción" → no cuenta la ó Agregar áéíóúü al string de vocales
  Entrada no string contarVocales(123) → error Validar con typeof texto === "string"
  Texto vacío / null contarVocales(null) → crash Retornar 0 si el input es falsy
```

### funcion 3
```bash
function estaOrdenado(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return true; // 
    }
    return false;
}
```
ChatGPT
```bash
La función se llama estaOrdenado, por lo tanto debería:

✅ Devolver true si el arreglo está ordenado

❌ Devolver false si no lo está

Pero actualmente hace lo contrario.

🧠 Tipo de bug

Es un bug de lógica invertida (booleano invertido).
La condición está bien, pero el return es incorrecto.
El algoritmo detecta correctamente el desorden,
pero devuelve el booleano opuesto al que su nombre promete.

Es un clásico error de lógica invertida 🔁
```
Claude
```bash
El bug está en los valores de retorno invertidos
La lógica de detección del bucle es correcta, pero los return están al revés. 
Cuando encuentra un elemento mayor que el siguiente (desorden), debería retornar false, y al terminar sin encontrar desorden, retornar true.

Bugs adicionales a considerar
Array vacío o de 1 elementoestaOrdenado([]) Retornar true directamente (ya funciona con la corrección)
Array con null / undefined[1, null, 3] → comportamiento inesperado Validar que todos los elementos sean números
No indica si es ascendente o descendente[3, 2, 1] devuelve false aunque esté ordenado descendente Agregar parámetro direccion

```

## Tercera Prueba

Ahora vamos a poner a prueba la capacidad de ambos asistentes de generar funciones apartir del lenguaje natural y que generen la implementacion

### funcion 1
Promt: Genera una funcion en javaScript que elminie las vocales de una frase.
Claude
```bash
function eliminarVocales(frase) {
  return frase.replace(/[aeiouáéíóú]/gi, "");
}

console.log(eliminarVocales("mi coche rojo")); // "m cch rj"
```
ChatGPT
```bash
function eliminarVocales(frase) {
  return frase.replace(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g, '');
}

console.log(eliminarVocales("mi coche rojo")); // " cch rj"
```
### funcion 2
Promt: Genera una funcion en javaScript que calcule descuentos que pueden variar
Claude
```bash
function calcularDescuento(precio, porcentaje) {
  const descuento = precio * (porcentaje / 100);
  const precioFinal = precio - descuento;
  return {
    precioOriginal: precio,
    porcentajeDescuento: porcentaje,
    descuento: descuento.toFixed(2),
    precioFinal: precioFinal.toFixed(2)
  };
}
// Ejemplos de uso:
console.log(calcularDescuento(100, 10));  // 10% de descuento
console.log(calcularDescuento(250, 25));  // 25% de descuento
console.log(calcularDescuento(80, 50));   // 50% de descuento
```
ChatGPT
```bash
function calcularDescuento(precio, descuento, tipo = "porcentaje") {
  if (precio < 0) {
    throw new Error("El precio no puede ser negativo");
  }

  let total;

  if (tipo === "porcentaje") {
    if (descuento < 0 || descuento > 100) {
      throw new Error("El porcentaje debe estar entre 0 y 100");
    }
    total = precio - (precio * descuento / 100);
  } else if (tipo === "fijo") {
    if (descuento < 0) {
      throw new Error("El descuento fijo no puede ser negativo");
    }
    total = precio - descuento;
  } else {
    throw new Error("Tipo de descuento no válido");
  }

  // Evita que el total sea negativo
  return total < 0 ? 0 : total;
}
// Ejemplos:
console.log(calcularDescuento(100, 20)); // 80 (20%)
console.log(calcularDescuento(100, 15, "fijo")); // 85
```
### funcion 3
Promt: Genera una funcion en javaScript que te diga si un numero es primo o no
Claude
```bash
function esPrimo(numero) {
  if (numero < 2) return false;
  if (numero === 2) return true;
  if (numero % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(numero); i += 2) {
    if (numero % i === 0) return false;
  }

  return true;
}
// Ejemplos de uso:
console.log(esPrimo(2));   // true
console.log(esPrimo(7));   // true
console.log(esPrimo(10));  // false
console.log(esPrimo(13));  // true
```
ChatGPT
```bash
function esPrimo(numero) {
  if (numero <= 1) return false;
  if (numero === 2) return true;
  if (numero % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(numero); i += 2) {
    if (numero % i === 0) {
      return false;
    }
  }

  return true;
}

// Ejemplos:
console.log(esPrimo(7));  // true
console.log(esPrimo(10)); // false
console.log(esPrimo(2));  // true
console.log(esPrimo(1));  // false
```



En esta prueba los resultados han sido similares por no decir que dan el mismo resultado a excepción de la segunda funcion en la cual ChatGPT ha ido mas alla de lo que especifique en el promt y añadio validaciones de errores e impide que haya numeros negativos.




