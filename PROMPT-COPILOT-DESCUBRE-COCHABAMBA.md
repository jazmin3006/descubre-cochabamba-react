# PROMPT PARA COPILOT — MIGRACIÓN DE DESCUBRE COCHABAMBA A REACT

Necesito que migres completamente el proyecto Legacy ubicado en `.docs/Legacy` al proyecto React existente.

El Legacy está implementado con HTML, JavaScript y CSS tradicional. Debes trasladar su interfaz y comportamiento al proyecto React, conservando la funcionalidad, la estructura visual y la experiencia de usuario originales. No realices una simple conversión HTML a JSX: primero comprende el funcionamiento completo y después impleméntalo correctamente en React.

## Fuentes de referencia

### 1. Proyecto Legacy

Analiza exhaustivamente `.docs/Legacy` y úsalo como fuente de verdad para identificar:
- Pantallas, secciones y layouts.
- Formularios, navegación e interacciones.
- Eventos JavaScript y validaciones.
- Estados visuales y comportamiento responsive.
- Estilos, imágenes, iconos, fuentes y otros assets.
- Flujos de usuario.

No modifiques los archivos originales de `.docs/Legacy`.

### 2. Librería de componentes

Revisa `.docs/Liberia-de-Componentes` antes de crear componentes nuevos.
1. Identifica los componentes documentados que corresponden a cada parte del Legacy.
2. Reutiliza los componentes existentes siempre que sea posible.
3. Si falta un componente, créalo siguiendo las convenciones reales de la librería.
4. Evita duplicar componentes.

Si la carpeta solo contiene un README indicando que falta la documentación real, informa de esa limitación. No inventes contenido ni afirmes haber consultado documentación que no está presente. Continúa usando las convenciones verificables del proyecto y deja señalado lo que requiera la documentación faltante.

## Objetivo

Migrar el Legacy al proyecto React existente, manteniendo:
- Apariencia visual y estructura.
- Layout, espaciados, tipografía y colores originales.
- Responsive design.
- Navegación y contenido turístico.
- Buscador y filtros por categoría.
- Tarjetas y detalles de destinos.
- Planificador y recorridos recomendados.
- Persistencia del recorrido, si existe en el Legacy.
- Formularios de reserva, validaciones, confirmaciones y mensajes.
- Modales, estados y demás interacciones.

El resultado debe sentirse como la misma aplicación Legacy, correctamente implementada en React. No hagas un rediseño arbitrario ni reemplaces la identidad de Descubre Cochabamba.

## Estrategia de implementación

Antes de modificar código:
1. Analiza la estructura del proyecto React actual y sus dependencias.
2. Analiza todos los archivos relevantes de `.docs/Legacy`.
3. Revisa `.docs/Liberia-de-Componentes`.
4. Identifica pantallas, componentes, estilos y funcionalidades.
5. Relaciona las partes del Legacy con los componentes disponibles.
6. Define una estrategia de migración incremental.

Después, implementa directamente los cambios necesarios en el proyecto React existente. No crees otro proyecto desde cero ni sustituyas la aplicación por una página de ejemplo.

## Principios técnicos

Respeta las convenciones actuales del proyecto y aplica DRY, KISS, YAGNI, Clean Code, componentización razonable, separación de responsabilidades y reutilización cuando aporten valor.

Evita sobreingeniería, duplicación de lógica, componentes excesivamente pequeños sin utilidad, dependencias innecesarias y refactors fuera del alcance.

## React

Transforma correctamente las funcionalidades JavaScript del Legacy:
- Utiliza `useState` u otros mecanismos ya adoptados para el estado.
- Usa eventos React en lugar de listeners DOM innecesarios.
- Sustituye la manipulación manual del DOM por renderizado declarativo.
- Utiliza hooks para efectos y ciclo de vida cuando corresponda.
- Extrae lógica y componentes reutilizables cuando tenga sentido.

Evita `document.querySelector`, `getElementById` y modificaciones manuales del DOM salvo que exista una razón técnica justificada.

## Estilos y assets

Antes de crear estilos nuevos, revisa el sistema de estilos existente, sus variables, clases, tokens y componentes. Reutiliza los estilos existentes cuando sea posible. Conserva los assets originales y sus referencias correctas. No sustituyas imágenes o recursos arbitrariamente.

Reproduce el diseño y los espaciados del Legacy en escritorio, tablet y móvil. Conserva breakpoints, orden, visibilidad y distribución responsive siempre que sea posible.

## Validación

Una vez implementado:
1. Ejecuta la aplicación React.
2. Corrige errores de compilación.
3. Ejecuta lint, typecheck y tests si existen scripts para ello.
4. Recorre todas las secciones migradas.
5. Comprueba navegación, buscador, filtros y tarjetas.
6. Prueba el planificador, recorridos y persistencia.
7. Prueba formularios, validaciones, mensajes y confirmaciones.
8. Comprueba modales e interacciones principales.
9. Revisa escritorio, tablet y móvil.
10. Compara visualmente el resultado con `.docs/Legacy`.
11. Si existen Playwright, Cypress u otras herramientas E2E, úsalas cuando sea posible.

No des por terminada la migración únicamente porque compile. No afirmes haber ejecutado pruebas que no se hayan ejecutado realmente.

## Restricciones

- No modificar `.docs/Legacy`.
- No eliminar funcionalidades existentes.
- No cambiar flujos sin justificación.
- No introducir cambios visuales arbitrarios.
- No crear componentes duplicados.
- No añadir dependencias innecesarias.
- No rehacer partes ajenas al alcance.
- Mantener las convenciones del proyecto React actual.

## Resultado esperado

Deja el proyecto React ejecutable y funcionalmente equivalente al Legacy, usando correctamente los componentes documentados que estén disponibles.

Al finalizar, entrega un resumen que indique:
- Pantallas y funcionalidades migradas.
- Componentes creados y reutilizados.
- Archivos principales modificados.
- Validaciones y comandos ejecutados con sus resultados reales.
- Tests ejecutados y resultados.
- Diferencias conocidas respecto al Legacy.
- Pendientes, limitaciones o riesgos detectados.

Trabaja de forma autónoma: inspecciona primero los archivos reales, toma decisiones basadas en las convenciones del repositorio y completa la migración hasta dejar el proyecto ejecutable y validado.
