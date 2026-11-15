# Consulta Presbiteriana — inicio y estado del sistema

Actualizado: 14 de octubre de 2026. Edición de trabajo no oficial.

**El sistema está preparado para consultas locales.** No hace falta esperar las confirmaciones documentales restantes para consultar los textos con sus advertencias. Esas confirmaciones, la revisión editorial final y la aprobación competente siguen pendientes para una edición definitiva.

## Abrir en Windows

1. Descargar `consulta_presbiteriana.zip` y extraer todo su contenido. No ejecutar los archivos dentro del ZIP.
2. Tener Node.js instalado. El proyecto de desarrollo requiere Node.js 22.12 o posterior compatible con sus dependencias.
3. Abrir `Iniciar_Consulta.cmd` con doble clic. El iniciador comprueba que Node.js y la aplicación compilada estén presentes.
4. El navegador se abre en `http://127.0.0.1:4173/`. Si no se abre, copiar esa dirección en el navegador.
5. Mantener abierta la ventana del servidor mientras se usa el sistema. Para cerrarlo, pulsar Ctrl+C en esa ventana.

El paquete incluye la compilación, los documentos y los PDF. Para consultar no necesita instalar dependencias npm, ejecutar Python, iniciar sesión ni proporcionar claves de servicios. Después de tener Node.js y extraer el paquete, los datos se sirven desde la misma computadora. En Mac/Linux, abrir una terminal en la carpeta extraída y ejecutar `sh Iniciar_Consulta.sh`.

Si el puerto está ocupado, cerrar otra instancia o ejecutar `node scripts/serve_local.mjs --port 4174 --open`. No abrir `build/index.html` directamente: el corpus y los archivos se cargan mediante el servidor local.

## Usar las consultas

- **Membresía:** escribir «membresía» o «membros» y consultar. La búsqueda usa ambos idiomas.
- **Un artículo concreto:** escribir «Art. 84» y seleccionar normativa **CI**. El número solo puede aparecer en varios cuerpos normativos.
- **Textos de 2026:** activar la lectura integrada para ver cambios expresos y sus anotaciones; comparar con el texto histórico cuando aparezca esa opción.
- **Fuentes:** abrir un resultado para consultar su identificador, páginas PDF, notas, decisiones vinculadas y límites documentales.
- **Idioma:** elegir por separado el idioma de interfaz y el de lectura.
- **Guardar:** usar «Descargar .md» para exportar las coincidencias y referencias vinculadas. «Copiar consulta» depende del permiso del navegador; la descarga ofrece otra forma de guardar.

Es un buscador documental bilingüe con vínculos y exportaciones. No es un chat generativo: una pregunta extensa puede requerir buscar por su tema o por un artículo concreto.

## Búsqueda mientras escribís y palabras resaltadas

**Todas las palabras** es la opción predeterminada. Escribí, por ejemplo, «carta de transf»: los resultados aparecen sin pulsar Consultar y la última palabra puede estar incompleta. Al agregar palabras se exige que aparezcan dentro del mismo artículo, nota o decisión, en una misma versión del texto. Se omiten palabras gramaticales comunes.

El orden es: palabras juntas, misma oración y distintas partes del mismo artículo. Las coincidencias aparecen resaltadas en amarillo en los resultados y en la lectura del artículo, sus textos históricos, enmiendas y referencias abiertas. El resaltado ignora mayúsculas y acentos, sin modificar el texto. Si una coincidencia está sólo en portugués, se identifica ese idioma y se abre el texto que contiene las palabras.

Las sugerencias se obtienen de documentos encontrados: se pueden elegir con clic, o con flechas y Enter. Escape cierra la lista. **Palabras completas** desactiva la coincidencia de la última palabra incompleta. Para exigir una frase exacta, usar comillas: «"carta de transferencia"».

**Precisa por asunto** permite explorar conceptos y equivalencias bilingües aunque el artículo no use las mismas palabras de la consulta. **Ampliada** conserva la exploración general. Las notas y decisiones vinculadas siguen disponibles. Ningún modo garantiza detectar todas las relaciones implícitas.

## Qué está comprobado y qué falta

| Parte | Estado y trabajo pendiente |
| --- | --- |
| Manual 2025 | 1774/1774 registros y 560/560 páginas cotejados por el asistente |
| Digesto 2026 | 398/398 decisiones traducidas, cotejadas y examinadas por sus efectos |
| Rastreo transversal | 142/142 candidatas clasificadas; 0 pendientes de esa clasificación |
| Código de consulta | 186 pruebas pasaron en el cierre anterior; la entrega operacional repite las comprobaciones pertinentes |
| Arranque y entrega de archivos | Comprobación HTTP del servidor local, corpus, recursos iniciales, enlaces de descarga y PDF |
| Uso real en navegador | Pendiente inspección visual, búsqueda y lectura en tu computadora y en celular; permisos reales de copiar y descargar |
| Acceso por Internet | Falta elegir alojamiento, publicar y comprobar la dirección desplegada, si se desea compartir por enlace |
| Confirmaciones documentales | Siete grupos revisados: dos cerrados en su alcance y cinco pendientes, con fuentes y criterios en `pendientes_confirmacion_documental_2026_es.md`; no son un inventario exhaustivo |
| Edición definitiva | Armonización editorial final, compatibilidad global y aprobación competente pendientes |

Los siete grupos abarcan voto del ministro jubilado, adaptación de estatutos locales, alcance de las notas sobre emerencia, propuesta íntegra de los reglamentos de seminarios, base del RI-SE, estatutos institucionales y discrepancias documentales. Parte requiere documentación adicional o interpretación competente; los controles informáticos no resuelven esas cuestiones.

## Para compartir con otras personas

El servidor entregado sólo escucha en la computadora local. La dirección `127.0.0.1` no permite entrar desde otro celular o computadora. Para compartir por enlace hay que publicar la carpeta compilada `build/` en un alojamiento de archivos estáticos y probar allí las consultas, documentos y PDF. Si el alojamiento usa una subcarpeta, será necesario configurar esa ruta y volver a compilar.

El proyecto SvelteKit contiene las fuentes para futuras modificaciones. El paquete listo para usar contiene la compilación de esta entrega. Antes de distribuir una versión modificada, regenerar cuando corresponda, probar y volver a compilar.

La aprobación oficial del contenido no es requisito técnico para encender el buscador, pero sí debe mantenerse visible su carácter de edición de trabajo mientras no exista esa aprobación.
