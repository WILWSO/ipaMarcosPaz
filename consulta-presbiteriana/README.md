# Consulta Presbiteriana bilingüe — 0.2.0

Proyecto SvelteKit independiente para VS Code. Consultas locales español–portugués sobre el Manual Presbiteriano 2025 con notas y el Digesto iCalvinus 2026 proporcionados por el usuario. Incluye los PDF originales, sus referencias y un corpus de 900 artículos, 816 notas, 58 unidades complementarias y 398 resoluciones.

## Estado real de esta entrega

Manual histórico 2025 cotejado por el asistente: **1774/1774 unidades y 560/560 páginas del anexo**. Digesto 2026 traducido, cotejado y examinado por efectos: **398/398 decisiones**. Clasificación del rastreo transversal cerrada: **142/142 candidatas; 0 pendientes de clasificación**. No es una edición oficial ni reemplaza los documentos de la IPB.

- Los originales portugueses y los PDF (560 + 355 páginas) se conservan. Las seis enmiendas EC3–8, la revocación del inciso X principal de RI-CE8 y la sustitución del caput de ATAS3 se reflejan en el Manual integrado, conservando las partes no modificadas.
- Las demás decisiones tienen apuntes separados con fuentes, alcance y límites en el suplemento normativo de 398 decisiones por idioma. Los informes históricos conservan el avance de su respectiva entrega.
- Compatibilidad directa examinada: 8 artículos modificados, sus 25 notas y dos disposiciones relacionadas. El rastreo de 816 notas seleccionó 142 candidatas: 102 examinadas por su relación con las reformas, incluidas relaciones sin efecto directo, y 40 identificadas como referencias a otros dispositivos. El rastreo no agota las relaciones implícitas ni demuestra compatibilidad global definitiva.
- **Siete grupos seleccionados fueron examinados: dos cerrados en el alcance indicado y cinco con cuestiones pendientes**, con páginas y hashes, en `documentos/pendientes_confirmacion_documental_2026_es.md` y su par portugués. No son un inventario exhaustivo de dudas.
- Revisión editorial final, aprobación oficial de la traducción, certificación externa y compatibilidad global definitiva pendientes. Las búsquedas bilingües por palabras y sinónimos no identifican necesariamente todas las relaciones implícitas.

## Los seis documentos

| Documento | Portugués | Español |
| --- | --- | --- |
| Manual histórico 2025 | `documentos/manual_2025_pt.md` — completo | `documentos/manual_2025_es.md` — cotejo completo por el asistente |
| Digesto 2026 | `documentos/digesto_2026_pt.md` — completo | `documentos/digesto_2026_es.md` — 398/398 traducidas y cotejadas |
| Manual integrado | `documentos/manual_integrado_pt.md` — cambios expresos y anotaciones | `documentos/manual_integrado_es.md` — cambios expresos y anotaciones |

Las anotaciones editoriales se distinguen del texto normativo. El anexo conserva las 560 páginas, incluidos preliminares, títulos e índices, y repite deliberadamente contenido de las unidades estructuradas. Su armonización final con las unidades queda para la revisión editorial del conjunto. Los controles de software comprueban integridad y comportamiento de la aplicación, sin certificar equivalencia normativa ni ejecución posterior de las decisiones.

## Abrir en VS Code

Requiere Node.js 22.12 o posterior compatible con Vite 7.

```bash
npm ci
npm run dev
```

Abrir la dirección que muestre Vite. Elegir por separado idioma de interfaz e idioma de lectura; seleccionar la redacción integrada si corresponde. «membresía» y «membros» consultan el mismo índice. «Artículo 84» y «Artigo 84», con normativa CI, resuelven el mismo identificador. El idioma de lectura no restringe el idioma de búsqueda.

La búsqueda predeterminada es **Todas las palabras**. Los resultados aparecen al escribir, incluso con la última palabra incompleta, sin pulsar Consultar. Las palabras deben aparecer dentro del mismo artículo, nota o decisión, en una misma versión del texto; no se mezclan palabras de documentos distintos ni de una anotación editorial. Primero se muestran frases juntas, después coincidencias dentro de una oración y luego en distintas partes del artículo. Se omiten palabras gramaticales comunes de la consulta.

Las coincidencias se resaltan en amarillo en los títulos, fragmentos y texto abierto, conservando el original. Las sugerencias se obtienen de los documentos encontrados y se pueden elegir con clic o flechas y Enter; Escape las cierra. Las comillas exigen una frase exacta y **Palabras completas** desactiva el prefijo de la última palabra. **Precisa por asunto** conserva la búsqueda temática bilingüe y **Ampliada** permite explorar referencias generales. Ningún modo garantiza detectar todas las relaciones implícitas.

Cada resultado conserva su ID, estado documental y página PDF. El detalle permite comparar el texto histórico, consultar notas completas y decisiones vinculadas, y abrir el PDF. La exportación incluye TODAS las coincidencias, aunque la pantalla inicialmente muestre solo 30, con sus referencias vinculadas, sin duplicarlas. Los textos españoles faltantes aparecen identificados como originales portugueses.

```bash
npm test
npm run build
npm run preview
```

`build/` contiene la compilación estática. Debe servirse mediante HTTP; no abrir `index.html` directamente con `file://`. No se necesitan claves ni cuentas; las consultas no se envían a servicios externos. La verificación visual en navegador y en dispositivos del usuario sigue pendiente. La comprobación HTTP de arranque, recursos, documentos, PDF y consultas está registrada en documentos/estado_operativo_sistema_2026.json.

## Archivo principal de entrega

**consulta_presbiteriana.zip** reúne las fuentes, la aplicación compilada, documentos, PDF e iniciadores. Extraerlo completo y abrir `Iniciar_Consulta.cmd` con Node.js instalado. La compilación incluida permite consultar sin instalar dependencias npm ni ejecutar Python.

Para actualizar la entrega después de modificar el proyecto: `npm run entrega`. El comando regenera, prueba, compila, comprueba el arranque y escribe `../consulta_presbiteriana.zip`. Si falla alguna comprobación, conserva el ZIP anterior. El mismo nombre se utiliza en cada entrega; no se sustituye por un archivo con otro nombre.

## Paquete listo para usar

`consulta_presbiteriana_lista_para_usar.zip` incluye la aplicación compilada, los documentos y PDF, un servidor local y los iniciadores. Extraer todo el ZIP y, en Windows, abrir `Iniciar_Consulta.cmd`, con Node.js instalado. No requiere instalar las dependencias npm ni ejecutar Python para consultar. La guía `documentos/guia_inicio_sistema_2026_es.md` explica inicio, consultas y pendientes. En Mac/Linux: `sh Iniciar_Consulta.sh`. Mantener abierta la ventana del servidor; Ctrl+C lo cierra. Se abre en `http://127.0.0.1:4173/` y sólo atiende en la computadora local.

El ZIP del proyecto SvelteKit conserva fuentes y permite desarrollar con `npm ci` y `npm run build`; el paquete listo para usar conserva la compilación. Publicar para otras personas requerirá elegir el alojamiento y probar la versión desplegada. No hay un servidor remoto publicado por esta entrega.

Comprobación reproducible después de compilar: `npm run check:runtime`. Abre un servidor temporal, comprueba recursos y consultas, y lo cierra. La comprobación HTTP no sustituye la inspección visual ni confirma los permisos reales del portapapeles en el navegador.

## Continuar la traducción y regenerar

1. Agregar traducciones completas por identificador a `documentos/traducciones_es.json`. Traducir el texto, NO resumirlo; conservar las referencias `[n]`, numeración, incisos y párrafos.
2. Ejecutar `npm run documents`. El generador verifica los marcadores de notas, actualiza corpus, cobertura y los seis Markdown. No modifica los PDF originales.
3. Cotejar cada traducción con el original. El estado `traducido-de-trabajo` no equivale a revisión externa. `documentos/cola_traduccion.json`, el corpus y `estado_bilingue.json` se actualizan al regenerar. Las traducciones del asistente prevalecen sobre las automáticas. Los archivos automáticos permanecen separados para que puedan auditarse.
4. Ejecutar `npm test` y `npm run build`.

La extracción completa puede reproducirse con Python y PyMuPDF: ejecutar `scripts/extract.py`, luego `scripts/integrate.py` y finalmente `scripts/bilingual.py`. Los dos primeros pasos reconstruyen la base; no ejecutarlos solos al actualizar traducciones, pues la versión bilingüe se aplica en el último paso. Las fuentes deben estar disponibles en las rutas previstas por el extractor.

## Procedencia y vigencia

`static/corpus.json` conserva los hashes SHA-256 de los PDF, ID compartido por idiomas, página, texto original, traducción, notas, enlaces y estado. El generador guarda también el hash del original de cada traducción para cotejar cambios. `documentos/estado_bilingue.json` registra cobertura completa del Manual y del Digesto, con aprobación oficial pendiente. `informe_traduccion_manual.json` registra cobertura, hash del modelo, problemas detectados y revisión pendiente. `notas_editoriales_traduccion.md` explica las aparentes erratas conservadas.

Las clasificaciones contrastadas distinguen promulgación, interpretación, transición, rechazo y procedimiento pendiente. Por ejemplo, SC-2026-CCVI no reemplaza todavía CI art. 23 §2; SC-2026-CCXXXIX no equivale a un Código de Disciplina nuevo. Las menciones numéricas no verificadas no se convierten automáticamente en reformas.

## Estructura

- `src/routes/+page.svelte`: interfaz y lectura PT/ES.
- `src/lib/search.mjs`: índice bilingüe, referencias y exportación.
- `scripts/bilingual.py`: generación de documentos e integración de EC 3–8.
- `documentos/traducciones_es.json`: traducciones por ID.
- `static/corpus.json`: corpus completo y avance real.
- `static/documentos/`: PDF y seis Markdown descargables.
- `tests/`: búsquedas, cobertura, referencias, integración y exportación.

## Reproducir el borrador automático

La aplicación SvelteKit NO necesita el modelo ni Python para consultar. Para regenerar las traducciones automáticas se requieren Python, `ctranslate2` y `sentencepiece`, y el paquete Argos portugués→español 1.0. El motor se ejecutó localmente, sin enviar el Manual a un servicio externo.

Documentación oficial: https://github.com/argosopentech/argos-translate
Modelo utilizado: https://data.argosopentech.com/argospm/v1/translate-pt_es-1_0.argosmodel

Descomprimir el modelo y ejecutar:

```bash
python3 scripts/translate_manual_local.py --model /ruta/translate-pt_es-1_0
python3 scripts/finalize_manual_translation.py
npm run documents
npm test
npm run build
```

`cache_traduccion_manual.json` permite retomar el procesamiento. Los controles conservan números, citas y marcadores; no verifican la exactitud semántica de cada frase. La traducción automática puede contener errores gramaticales, terminológicos o de sentido que todavía requieren cotejo con el portugués. Para usos normativos, el original permanece accesible mediante la página PDF correspondiente.

## Revisión comparada del 5 de octubre de 2026

El Manual español NO está aprobado como fuente definitiva. Se cotejaron 1774 unidades completas, con correcciones cuando fue necesario. El anexo automático duplica el contenido y puede conservar errores ya corregidos en los registros; exige revisión separada antes de aprobar el Manual integralmente. El informe `documentos/revision_manual_2025_es.md` documenta el alcance; `correcciones_revision_manual.json` conserva originales y versiones antes/después. Los controles automáticos de integridad abarcan 1774 unidades y no equivalen a revisión semántica. La interfaz y la exportación mantienen visible este estado.

## Constitución de 2025 revisada

El archivo `documentos/constitucion_2025_es_revisada.md` contiene el preámbulo, los 152 artículos y las 361 notas, cotejados por el asistente con el texto portugués extraído del PDF. Conserva capítulos, secciones, referencias y enlaces. `constituicao_2025_pt.md` permite cotejar la misma estructura en portugués. La misma revisión se incorpora a la sección estructurada de `manual_2025_es.md`. El resto del Manual y su anexo por páginas también tienen cotejo textual completo. La revisión histórica de 2025 no equivale a aprobar la integración de reformas de 2026 ni a certificación oficial.

El Código de Disciplina histórico de 2025 también fue cotejado íntegramente: preámbulo, 135 artículos y 104 notas. Los documentos independientes son `codigo_disciplina_2025_es_revisado.md` y `codigo_disciplina_2025_pt.md`. El cotejo textual del resto del Manual y del anexo por páginas también está completo.

## Avance — 5 de octubre de 2026

Constitución y Código de Disciplina: cotejo completo. Liturgia: preámbulo, 44/44 artículos y 59/59 notas cotejados. Estatuto IPB: texto introductorio, 47 bloques de artículos y 15 notas cotejados; se conserva el número 44 duplicado del PDF. Reglamento Interno del Supremo Concilio: 82 artículos y 3 notas cotejados. Reglamento Interno de la Comisión Ejecutiva: 37 artículos y 3 notas cotejados. Modelo de Estatuto del Sínodo: 31 artículos y 9 notas cotejados. Modelo de Reglamento Interno del Sínodo: 96 artículos y 2 notas cotejados. Modelo de Estatuto del Presbiterio: 62 artículos y 135 notas cotejados. Modelo de Reglamento Interno del Presbiterio: 99 artículos y 2 notas cotejados. Modelo de Estatuto de la Iglesia: 57 artículos y 116 notas cotejados. Reglamento Interno de la Junta Diaconal: 34 artículos y una nota cotejados. Reglamento de Actas: 24 artículos y seis notas cotejados. Total: 1774/1774 unidades. La lista está en `documentos/lista_trabajo_manual_presbiteriano.md`. Preliminares, separadores, sumario e índices: 58/58 páginas cotejadas. Siguiente: traducción y cotejo del Digesto 2026, seguido de integración de reformas. El anexo tiene 560/560 páginas cotejadas y 0 pendientes de revisión separada. `npm run documents` regenera documentos, auditoría y lista. El Digesto español y la integración de 2026 siguen siendo parciales.

Los documentos `reglamento_sc_2025_es_revisado.md` y `regimento_sc_2025_pt.md` incluyen índice, capítulos, secciones y remisiones a las tres notas. La traducción conserva los numerales repetidos del art. 35 y explica esa anomalía. El cotejo histórico no verifica vigencia en 2026.

Los archivos `reglamento_ce_2025_es_revisado.md` y `regimento_ce_2025_pt.md` incluyen los 37 artículos y las tres notas del RI-CE. Se conserva la distinción de la nota 3 entre suspender o alterar resoluciones en el supuesto citado y dejarlas sin efecto. La lectura comparada histórica no verifica reformas ni vigencia en 2026.

Los archivos `estatuto_sinodo_2025_es_revisado.md` y `estatuto_sinodo_2025_pt.md` contienen los 31 artículos y las nueve notas del modelo, con espacios para completar preservados. Las observaciones editoriales explican las omisiones corregidas, las formulaciones distintas de los arts. 18 y 30 y el numeral V impreso en la nota 9.

El modelo de Reglamento Interno del Sínodo se entrega en `documentos/reglamento_sinodo_2025_es_revisado.md` y `documentos/regimento_sinodo_2025_pt.md`: 96 artículos y dos notas, con índice, estructura del original, enlaces y observaciones editoriales.

El modelo de Estatuto del Presbiterio está en `documentos/estatuto_presbiterio_2025_es_revisado.md` y `documentos/estatuto_presbiterio_2025_pt.md`: 62 artículos y 135 notas completas. Liturgia se entrega como `principios_liturgia_2025_es_revisado.md`; su preámbulo, 44 artículos y 59 notas tienen cotejo completo; siguen pendientes el anexo automático y las reformas de 2026.


Anexo completo: 560/560 páginas; sin continuaciones abiertas. Siguiente etapa: Digesto 2026 e integración de reformas. Los lotes cotejados se entregan en Markdown PT/ES.

## Digesto — 11 de octubre de 2026

Tercer lote: diez decisiones completas CCXXI–CCXII (páginas 10–13), en `digesto_lote_021_030_2026_es_revisado.md` y `digesto_lote_021_030_2026_pt.md`. Nombramientos de JURET, comisión de drogas y CM; mandatos hasta CE 2028 preservados. Avance: 31/398 traducidas, 30 cotejadas. Próximo: SC-2026-CCXI.

## Digesto — cuarto lote

Diez decisiones completas CCXI–CCII, páginas 13–27. Archivos `digesto_lote_031_040_2026_es_revisado.md` y `digesto_lote_031_040_2026_pt.md`. Avance 41/398 traducidas, 40 cotejadas. Se distinguen rechazos, trámite de enmienda y estudio futuro de reformas. Próximo: SC-2026-CCI.

## Digesto — quinto lote

CCI cotejada y nueve traducciones nuevas CC–CXCII. Documentos `digesto_lote_041_050_2026_es_revisado.md` y `digesto_lote_041_050_2026_pt.md`. Avance 50/398 traducidas y cotejadas. Integración mantiene seis enmiendas. Próximo: SC-2026-CXCI.

## Digesto — lote ampliado 51–70

Veinte decisiones completas CXCI–CLXXII en `digesto_lote_051_070_2026_es_revisado.md` y `digesto_lote_051_070_2026_pt.md`. Avance 70/398 traducidas y cotejadas. Se distinguen la reforma de educación teológica con transición, cambios UPA y orientación de actas. Integración de estas decisiones pendiente; se conservan las seis enmiendas existentes. Próximo: SC-2026-CLXXI.

## Digesto — lote ampliado 71–90

Veinte decisiones CLXXI–CLII en `digesto_lote_071_090_2026_es_revisado.md` y `digesto_lote_071_090_2026_pt.md`. Avance 90/398 traducidas y cotejadas. Cooperación académica, comisiones de estudio y extensiones condicionadas identificadas; efectos adicionales pendientes de integración. Próximo: SC-2026-CLI.

## Digesto — lote ampliado 91–110

Veinte decisiones CLI–CXXXII en `digesto_lote_091_110_2026_es_revisado.md` y `digesto_lote_091_110_2026_pt.md`. Avance 110/398 traducidas y cotejadas. Consultas sobre Cena, menores, contribuciones y competencias preservadas; integración de efectos adicionales pendiente. Próximo: SC-2026-CXXXI.

## Digesto — lote ampliado 111–130

Veinte decisiones CXXXI–CXII en `digesto_lote_111_130_2026_es_revisado.md` y `digesto_lote_111_130_2026_pt.md`. Avance 130/398 traducidas y cotejadas. Restricciones, excepciones, debido proceso y anomalías originales preservados. Consejo de Historia y revocaciones reglamentarias registrados, aún sin integrar efectos adicionales. Próximo: SC-2026-CXI.

## Digesto — lote ampliado 131–150

Veinte decisiones CXI–XCII en `digesto_lote_131_150_2026_es_revisado.md` y `digesto_lote_131_150_2026_pt.md`. Avance 150/398 traducidas y cotejadas. CSM reformulada y CE-2026 CXIX revocada; Consejo de Acogida creado; correcciones sinodales preservadas. Efectos adicionales aún sin integración exhaustiva. Próximo: SC-2026-XCI.

## Digesto — lote ampliado 151–170

Veinte decisiones XCI–LXXII en `digesto_lote_151_170_2026_es_revisado.md` y `digesto_lote_151_170_2026_pt.md`. Avance 170/398 traducidas y cotejadas. Aprobaciones sinodales y correcciones de actas, firmas y estadísticas preservadas; anomalías originales señaladas. Efectos adicionales aún sin integración exhaustiva. Próximo: SC-2026-LXXI.

## Digesto — lote ampliado 171–190

Veinte decisiones LXXI–LII en `digesto_lote_171_190_2026_es_revisado.md` y `digesto_lote_171_190_2026_pt.md`. Avance 190/398 traducidas y cotejadas. Aprobaciones de actos diferenciadas de correcciones documentales; continuidad de Mesa, Tribunal de Recursos, cuentas y plazos preservados. Efectos adicionales aún sin integración exhaustiva. Próximo: SC-2026-LI.

## Digesto — lote ampliado 191–210

Veinte decisiones LI–XXXII en `digesto_lote_191_210_2026_es_revisado.md` y `digesto_lote_191_210_2026_pt.md`. Avance 210/398 traducidas y cotejadas. Actas e informes completos; datos incompletos, duplicaciones y correcciones expresas preservados. Efectos adicionales aún sin integración exhaustiva. Próximo: SC-2026-XXXI.

## Digesto — lote ampliado 211–230

Veinte decisiones XXXI–XII en `digesto_lote_211_230_2026_es_revisado.md` y `digesto_lote_211_230_2026_pt.md`. Avance 230/398 traducidas y cotejadas. Recursos, correcciones y cifras incompatibles preservados. Tropical sin aprobación expresa; Costa do Sol aprueba actos/actas, no informe financiero. Efectos adicionales aún sin integración exhaustiva. Próximo: SC-2026-XI.

## Digesto — lote ampliado 231–250

Ocho decisiones SC XI–IV y doce CE CLXIII–CLII en `digesto_lote_231_250_2026_es_revisado.md` y `digesto_lote_231_250_2026_pt.md`. Avance 250/398 traducidas y cotejadas; 148 pendientes. Competencias, estudios y condiciones patrimoniales preservados. Integración adicional todavía pendiente. Próximo: CE-2026-CLI, página 258.

## Digesto — lote 251–260

Diez decisiones CE CLI–CXLII en `digesto_lote_251_260_2026_es_revisado.md` y `digesto_lote_251_260_2026_pt.md`. Avance 260/398 traducidas y cotejadas; 138 pendientes. Garantías, remisiones y condiciones preservadas; integración adicional pendiente. Próximo CE-2026-CXLI, páginas 262–272.

## Digesto — decisión 261

CE-CXLI completa en `digesto_lote_261_2026_es_revisado.md` y `digesto_lote_261_2026_pt.md`: 11 páginas, considerandos y estatuto IBN de 31 artículos. Avance 261/398 traducidas y cotejadas; 137 pendientes. Competencias y condiciones de vigencia preservadas; integración adicional pendiente. Próximo CE-2026-CXL, página 273.

## Digesto — lote 262–271

Diez decisiones CE CXL–CXXXI completas en `digesto_lote_262_271_2026_es_revisado.md` y `digesto_lote_262_271_2026_pt.md`. Avance 271/398; 127 pendientes. Recursos, estudios, revisiones y actos patrimoniales con condiciones preservadas; integración adicional pendiente. Próximo CE-2026-CXXX, página 283.

## Digesto — lote 272–281

Diez decisiones CE CXXX–CXXI completas en `digesto_lote_272_281_2026_es_revisado.md` y `digesto_lote_272_281_2026_pt.md`. Avance 281/398; 117 pendientes. Informes, archivos y remisiones con condiciones preservadas; integración adicional pendiente. Próximo CE-2026-CXX, página 292.

## Digesto — lote 282–291

Diez decisiones CE CXX–CXI completas en `digesto_lote_282_291_2026_es_revisado.md` y `digesto_lote_282_291_2026_pt.md`. Avance 291/398; 107 pendientes. Planes tecnológicos, consultas y compromisos preservados; integración adicional pendiente. Próximo CE-2026-CX, página 300.

## Digesto — lote ampliado 292–311

Veinte decisiones CE CX–XCI completas en `digesto_lote_292_311_2026_es_revisado.md` y `digesto_lote_292_311_2026_pt.md`. Avance 311/398; 87 pendientes. Disciplina, actas y registros con condiciones preservadas. CE-CII modifica art. 3 de actas; efecto todavía pendiente de integrar al Manual. Próximo CE-2026-XC, página 309.

## Digesto — lote ampliado 312–331

Veinte decisiones CE XC–LXXI completas en `digesto_lote_312_331_2026_es_revisado.md` y `digesto_lote_312_331_2026_pt.md`. Avance 331/398; 67 pendientes. Creación de sínodos, cambios estatutarios y aprobación contable con condiciones preservadas. Integración adicional pendiente. Próximo CE-2026-LXX, página 320.

## Digesto — lote ampliado 332–351

Veinte decisiones CE LXX–LI completas en `digesto_lote_332_351_2026_es_revisado.md` y `digesto_lote_332_351_2026_pt.md`. Avance 351/398; 47 pendientes. Cuentas, recurso Guará, diligencias y jubilaciones con condiciones preservadas. Integración adicional pendiente. Próximo CE-2026-L, página 332.

## Digesto — lote ampliado 352–371

Veinte jubilaciones CE L–XXXI completas en `digesto_lote_352_371_2026_es_revisado.md` y `digesto_lote_352_371_2026_pt.md`. Avance 371/398; 27 pendientes. Referencias, historiales completos y anomalías preservados. Integración adicional pendiente. Próximo CE-2026-XXX, página 342.

## Digesto — lote ampliado 372–391

Veinte jubilaciones CE XXX–XI completas en `digesto_lote_372_391_2026_es_revisado.md` y `digesto_lote_372_391_2026_pt.md`. Avance 391/398; 7 pendientes. Referencias, historiales y cronologías incompatibles conservadas. Integración adicional pendiente. Próximo CE-2026-X, página 352.

## Cierre de la traducción del Digesto — decisiones 392–398

Siete decisiones CE X–IV completas en `digesto_lote_392_398_2026_es_revisado.md` y `digesto_lote_392_398_2026_pt.md`. Digesto completo: 398/398 traducidas y cotejadas, 0 pendientes. Manual: 1774/1774 unidades y 560/560 páginas cotejadas. Integración normativa adicional, revisión editorial final y aprobación definitiva pendientes.

## Integración normativa — primer lote prioritario

Diez decisiones examinadas por sus efectos, 10/398; 388 pendientes. Se conserva el texto histórico y las seis EC. Integrada la revocación del inciso X del cuerpo principal de RI-CE art. 8 (SC-CXXIII), manteniendo el inciso X del párrafo único. CE-CXIX queda como antecedente revocado por SC-CIX. Orientaciones y procedimientos pendientes se anotan sin alterar los artículos. Expedientes PT/ES: `integracion_normativa_lote_01_2026_es.md` y `integracion_normativa_lote_01_2026_pt.md`. Próximo examen desde SC-CCXLI, sin repetir los diez cotejados; prioridad a Actas art. 3 y reglamentos con transición.

## Integración normativa — lote 02

Veinte decisiones más examinadas: 30/398 en total; 368 pendientes. Actas art. 3 tiene encabezamiento actualizado por CE-CII, conservando §§ 1–3 y la advertencia sobre sus modelos históricos. Las diecinueve decisiones SC restantes del lote se documentan como nombramientos, archivo o políticas específicas; no cambian artículos generales. Expedientes PT/ES `integracion_normativa_lote_02_2026_es.md` y `integracion_normativa_lote_02_2026_pt.md`. Próximo examen desde SC-CCXXI. Los expedientes anteriores se conservan como entregas históricas.

## Integración normativa — lote 03

Veinte decisiones más examinadas: 50/398 en total; 348 pendientes. Nuevas anotaciones sobre propuestas rechazadas o en estudio, nombramientos y recepción específica CCB. No se añaden sustituciones de artículos. Referencias históricas conservadas; nombramientos JURET con períodos individuales. Expedientes PT/ES `integracion_normativa_lote_03_2026_es.md` y `integracion_normativa_lote_03_2026_pt.md`. Próximo examen desde SC-CXCVIII.

## Integración normativa — lote 04

Veinte decisiones más examinadas: 70/398 en total; 328 pendientes. Educación teológica con 29 ajustes, revocación RI-JET y transición hasta SC 2030; texto-base completo no reconstruido. Estructura/presupuesto SNTA y aprobación del himno UPA registrados con alcance y condiciones. Nombramientos, documentos sin objeto e informes distinguidos. Expedientes PT/ES `integracion_normativa_lote_04_2026_es.md` y `integracion_normativa_lote_04_2026_pt.md`. Próximo examen desde SC-CLXXVII.

## Integración normativa — lote 05

Veinte decisiones más examinadas: 90/398 en total; 308 pendientes. Informes institucionales, cooperaciones CPAJ, conservación del Credo, estudios pendientes, recepción IASD y extensiones São Luís/Espírito Santo anotados con sus condiciones. No se añaden sustituciones de artículos. Expedientes PT/ES `integracion_normativa_lote_05_2026_es.md` y `integracion_normativa_lote_05_2026_pt.md`. Próximo examen desde SC-CLVII.


### Integración normativa 06 — 13 de octubre de 2026

110/398 decisiones examinadas; 288 pendientes. Lote de veinte SC CLVII–CXXXVII, excluyendo CLIV ya examinada. Aprobaciones condicionadas, interpretación de Santa Cena, protección de menores, contribuciones, presupuesto e informes separados del texto histórico. Discrepancias de referencias documentadas; no se incorporan nuevas sustituciones de artículos. Próximo: SC-CXXXVI.


### Integración normativa 07 — 13 de octubre de 2026

130/398 decisiones examinadas; 268 pendientes. Veinte SC CXXXVI–CXVI, excluyendo CXXIII ya examinada. Informes, actas CE, predicación/enseñanza, consultas doctrinales y procesos registrados con límites y referencias. No se incorporan nuevas sustituciones de artículos. Próximo: SC-CXV.


### Integración normativa 08 — 13 de octubre de 2026

150/398 decisiones examinadas; 248 pendientes. Veinte SC CXV–XCV, excluyendo CIX ya examinada. Orientaciones, propuestas, estudios, consejo de acogimiento, calendario y exámenes sinodales registrados con límites. Sin nuevas sustituciones de artículos. Próximo: SC-XCIV.


### Integración normativa 09 — 13 de octubre de 2026

170/398 examinadas; 228 pendientes. Veinte SC XCIV–LXXV: exámenes sinodales, corrección sin borrar originales, reenvío en 60 días, rectificaciones estadísticas y distinción de sesiones y organización institucional. Sin nuevas sustituciones de artículos. Próximo: SC-LXXIV.


### Integración normativa 10 — 13 de octubre de 2026

190/398 examinadas; 208 pendientes. Veinte SC LXXIV–LV: exámenes sinodales, libro a rehacer, continuidad y Tribunal, cuentas y tesorería, correcciones y estatuto para aprobación plenaria. Sin nuevas sustituciones de artículos. Próximo: SC-LIV.


### Integración normativa 11 — 13 de octubre de 2026

210/398 examinadas; 188 pendientes. Veinte SC LIV–XXXV: exámenes sinodales, informes, plazos históricos, Tribunal, quórum, datos, privacidad y correcciones. Sin nuevas sustituciones de artículos. Próximo: SC-XXXIV.


### Integración normativa 12 — 13 de octubre de 2026

230/398 examinadas; 168 pendientes. Veinte SC XXXIV–XV: exámenes, correcciones, plazos, datos y divergencias documentadas. Tropical conserva examen pendiente. Sin nuevas sustituciones de artículos. Próximo: SC-XIV.


### Integración normativa 13 — 13 de octubre de 2026

250/398 examinadas; 148 pendientes. Veinte SC XIV–IV y CE CLXIII–CLV: gobierno, estudios, procedimientos, presupuesto, contratos y patrimonio documentados con condiciones. Sin nuevas sustituciones de artículos. Próximo: CE-CLIV.


## Integración normativa 14 — 14 de octubre de 2026

Veinte decisiones CE CLIV–CXXXV examinadas. Actos patrimoniales y estudios diferenciados de ejecución; estatuto IBN completo conservado con adecuaciones y límites. Prórroga de cartas-voto CD, recursos administrativos, comunicación previa de plantación e iCalvinus documentados. Libros digitales sujetos a estudio; revocaciones externas parciales de 2025 y remisión GTSI sin reforma aprobada. Sin nuevas sustituciones de artículos. Avance normativo 270/398; 128 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-CXXXIII.


## Integración normativa 15 — 14 de octubre de 2026

Veinte decisiones CE CXXXIII–CXIV examinadas. Incorporación HERV y cierre Cidade Mackenzie con encargos pendientes; informes, nombramientos y comodato diferenciados. Estudios CPSS, PBET, Angola y estadística; lanzamiento JMN autorizado. CE-CXIX conservada como antecedente revocado por SC-CIX. Interpretaciones sobre poderes de transferencia y palabra del emérito sin voto; discrepancia CI88 l/c señalada. CESEPPI devuelta y ECA remitida sin mérito. Sin nuevas sustituciones de artículos. Avance normativo 290/398; 108 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-CXIII.


## Integración normativa 16 — 14 de octubre de 2026

Veinte decisiones CE CXIII–XCII examinadas, excluyendo CIII/CII ya revisadas. Repase mensual APMT ordenado sin adjudicación expresa de indemnizaciones; carta CI125 de jurisdicción y procedimientos SAF diferenciados. Remisiones al SC y consulta FAP sin mérito. Sustento disciplinar facultativo, sin pago automático ni límite de un año tomado de propuesta. Diez registros presbiteriales con siglas condicionadas y datos históricos conservados. Sin nuevas sustituciones de artículos. Avance normativo 310/398; 88 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-XCI.


## Integración normativa 17 — 14 de octubre de 2026

Veinte decisiones CE XCI–LXXII examinadas. Registros presbiteriales, fusión PCEC y creación de cuatro sínodos con comisiones especiales diferenciados de ejecución. Estatutos Erasmo Braga/APMT, comodato Palmas y minutas SAC/SCH/SCI con alcance específico. Informes contables aprobados sin certificación independiente; IBAA sin mérito por competencia. Exceso CE2025 de 44,59% y falta de aprobación previa JPEF conservados; siglas PRCV/PRER frente a PBCV/PBER señaladas. Sin nuevas sustituciones de artículos. Avance normativo 330/398; 68 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-LXXI.


## Integración normativa 18 — 14 de octubre de 2026

Veinte decisiones CE LXXI–LII examinadas. Informes aprobados con controles; Noroeste pendiente, sin aprobación de cuentas, y 60 días para examen. Guará: transferencias y disolución anuladas, Eixo Sul válido, traslado PRGU ordenado. Coletivo suspendido sin mérito, Imperatriz remitida y difusión de carta litúrgica existente. Indicaciones JURETs remitidas con excepción Recife de dos años; siete jubilaciones individuales sin carga IPB. Sin nuevas sustituciones de artículos. Avance normativo 350/398; 48 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-LI.


## Integración normativa 19 — 14 de octubre de 2026

Veinte decisiones CE LI–XXXII examinadas: jubilaciones individuales sin carga IPB y honores. Referencias CI49 distintas conservadas; discrepancia de edad Valnei, trayectoria incompleta José Apolinário, numeración y datos biográficos señalados sin correcciones por suposición o declaración de invalidez. Sin nuevos beneficios nacionales, voto general o sustitución de artículos. Avance normativo 370/398; 28 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-XXXI.


## Integración normativa 20 — 14 de octubre de 2026

Veinte decisiones CE XXXI–XII examinadas: jubilaciones individuales sin carga IPB y honores. Referencias CI49 conservadas; discrepancias de edades Eudes/Antônio Célio, trayectoria Edilaney y cronología Anderson señaladas sin sustituir datos o declarar invalidez. Variantes nominales, geografía y biografía preservadas. Sin beneficios nacionales nuevos, voto general o sustitución de artículos. Avance normativo 390/398; 8 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-XI.


## Cierre del examen normativo — 14 de octubre de 2026

Últimas ocho decisiones CE XI–IV examinadas: jubilaciones, sentencia reformada, restauraciones y bajas CI48 a/b/c diferenciadas. Variantes nominales y terminológicas conservadas sin fusionar personas o atribuir condenas no documentadas. Se completa examen documental de efectos: 398/398; 0 pendientes. Digesto traducido y cotejado 398/398. Sin nuevas sustituciones de artículos. Próxima fase: consolidación y revisión editorial final; no hay certificación externa o aprobación definitiva de la edición española.
