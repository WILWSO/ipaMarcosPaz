"""Controles de integridad y señales de revisión: no certifica equivalencia semántica."""
from pathlib import Path
import json,re,hashlib,collections
ROOT=Path(__file__).resolve().parents[1];d=ROOT/'documentos';c=json.loads((ROOT/'static/corpus.json').read_text());reviews=json.loads((d/'revision_semantica_manual.json').read_text());manual=[r for r in c['records'] if r['source']=='manual'];text=(d/'manual_2025_es.md').read_text()
patterns=re.compile(r'\b(?:não|são|funções|também|órgão|recém|Tesoureiro|Executivo|Efetivo|constrangido|findo|cassada|Julgadas|encaminhe|preceitua|regimento|regimentos|mormente|Ancião|Despenseiro)\b',re.I)
flags=[];errors=[]
for r in manual:
 pt=r['textOriginal'];es=r.get('textEs','')
 if re.findall(r'\[\d+\]',pt)!=re.findall(r'\[\d+\]',es):errors.append({'id':r['id'],'reason':'marcadores de notas'})
 terms=sorted(set(patterns.findall(es)))
 if terms:flags.append({'id':r['id'],'page':r['page'],'reason':'posibles residuos portugueses; puede incluir nombres propios o citas','terms':terms})
ids=set(re.findall(r'<a id="([^"]+)"></a>',text));missing=[r['id'] for r in manual if r['id'] not in ids]
pages=re.findall(r'^## Página PDF (\d+)$',text,re.M)
assert not errors and not missing and list(map(int,pages))==list(range(1,561))
result={'file':'manual_2025_es.md','date':'2026-10-14','approvedAsDefinitiveSource':False,'semanticReviewComplete':False,'structuredUnitsReviewComplete':c['metadata']['semanticReviewProgress']['structuredUnitsReviewComplete'],'frontMatterReviewProgress':c['metadata']['frontMatterReviewProgress'],'manualPageAnnexReviewComplete':c['metadata']['manualPageAnnexReviewComplete'],'pageAnnexReviewProgress':c['metadata']['pageAnnexReviewProgress'],'constitutionReviewProgress':c['metadata']['constitutionReviewProgress'],'disciplineReviewProgress':c['metadata']['disciplineReviewProgress'],'liturgyReviewProgress':c['metadata']['liturgyReviewProgress'],'minutesRulesReviewProgress':c['metadata']['minutesRulesReviewProgress'],'deaconRulesReviewProgress':c['metadata']['deaconRulesReviewProgress'],'churchStatuteReviewProgress':c['metadata']['churchStatuteReviewProgress'],'presbyteryRulesReviewProgress':c['metadata']['presbyteryRulesReviewProgress'],'presbyteryStatuteReviewProgress':c['metadata']['presbyteryStatuteReviewProgress'],'synodRulesReviewProgress':c['metadata']['synodRulesReviewProgress'],'synodStatuteReviewProgress':c['metadata']['synodStatuteReviewProgress'],'executiveRulesReviewProgress':c['metadata']['executiveRulesReviewProgress'],'supremeRulesReviewProgress':c['metadata']['supremeRulesReviewProgress'],'ipbStatuteReviewProgress':c['metadata']['ipbStatuteReviewProgress'],'integrityUnitsChecked':len(manual),'unitsIndividuallyComparedAndCorrected':len(reviews),'remainingUnitsWithoutThisComparativeReview':len(manual)-len(reviews),'emptySourceUnits':sum(not r['textOriginal'] for r in manual),'notesComparedAndCorrected':sum(r['kind']=='nota' and r['id'] in reviews for r in manual),'sourcePDFSHA256':c['metadata']['sources']['manual']['sha256'],'markdownSHA256':hashlib.sha256(text.encode()).hexdigest(),'integrityChecks':{'noteMarkers':'passed','recordAnchors':'passed','pageSequence560':'passed'},'candidatePortugueseResidueUnits':len(flags),'candidates':flags,'limitations':['Control de estructura no demuestra equivalencia normativa.','El cotejo de 1774 registros y 560 páginas está completo; la aprobación editorial definitiva sigue pendiente.','Las señales automáticas no son errores confirmados; requieren lectura comparada.','La redacción de 2025 es histórica y no garantiza vigencia normativa en 2026.']}
(d/'auditoria_revision_manual.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
rows='\n'.join(f"| {r['id']} | {r['page']} | {r['kind']} |" for r in manual if r['id'] in reviews)
report=f'''# Revisión de manual_2025_es.md — 14 de octubre de 2026

**Dictamen: NO APROBADO COMO FUENTE DEFINITIVA DEL SISTEMA.**

La revisión comparada encontró errores que alteraban el significado del original portugués. Se cotejaron los 152 artículos y las 361 notas de la Constitución (513 unidades), además de su preámbulo. También se cotejaron los 135 artículos y las 104 notas del Código de Disciplina (239 unidades) y su preámbulo. También están cotejados los {c["metadata"]["liturgyReviewProgress"]["comparedArticles"]} artículos y {c["metadata"]["liturgyReviewProgress"]["comparedNotes"]} notas de Principios de Liturgia, junto con su preámbulo. También se cotejaron los 47 bloques de artículos y las 15 notas del Estatuto IPB, junto con el texto introductorio; se conservan los dos artículos impresos como 44. También se cotejaron los 82 artículos y las 3 notas del Reglamento Interno del Supremo Concilio. También se cotejaron los 37 artículos y las 3 notas del Reglamento Interno de la Comisión Ejecutiva. También se cotejaron los 31 artículos y las 9 notas del modelo de Estatuto del Sínodo. También se cotejaron los 96 artículos y las 2 notas del modelo de Reglamento Interno del Sínodo. También se cotejaron los 62 artículos y las 135 notas del modelo de Estatuto del Presbiterio. También se cotejaron los 99 artículos y las dos notas del modelo de Reglamento Interno del Presbiterio. También se cotejaron los 57 artículos y las 116 notas del modelo de Estatuto de la Iglesia. También se cotejaron los 34 artículos y la nota del Reglamento Interno de la Junta Diaconal. También se cotejaron los 24 artículos y las seis notas del Reglamento de Actas. También se cotejaron 36 páginas de preliminares y separadores: páginas 1–4, 13 títulos de sección y 19 páginas sin contenido. Se verificó la separación de columnas de los créditos y la duplicación del encabezado de la página 4 contra las imágenes del PDF. Se corrigieron las traducciones que lo requerían. También se cotejaron las 22 páginas de sumario e índices, con las 331 entradas del sumario y todas sus remisiones. **Los 1774 registros del inventario tienen cotejo; no quedan unidades estructuradas sin cotejar.** El anexo tiene un cotejo independiente completo de 560/560 páginas. Las 398 decisiones de 2026 también están traducidas, cotejadas y examinadas por sus efectos; la revisión editorial definitiva del conjunto permanece pendiente.

## Errores confirmados y corregidos

| Pasaje | Error de la versión anterior | Corrección |
| --- | --- | --- |
| CI, nota 259 | Repetición «interesados e interesados» y pérdida de «envolvidos» | Sínodos interesados e involucrados; realizar las gestiones y acciones constitucionales |
| CI, art. 31 | Funciones «privadas» | Funciones exclusivas del ministro |
| CI, art. 40 | Vacaciones «con vencimientos» | Vacaciones con remuneración |
| CI, art. 48, § 1º | Alteración del sujeto que designa la iglesia | El Presbiterio designa la iglesia |
| CI, art. 49, § 4º | Pérdida de la negación sobre privilegios | La jubilación no implica pérdida de esos privilegios |
| CI, art. 131 | «la le indicará» en lugar de aplazar la ordenación | Aplazamiento; revocación de la licenciatura en el supuesto previsto |
| CI, arts. 132 y 136 | «recién coordinado» | Recién ordenado |
| CI, art. 139 | «enmiendas o jubilados» | Enmendados o reformados |
| CI, art. 140 | «disminuirá a los presbiterios» | Se remitirá a los presbiterios |
| CI, art. 150 | «corazones» | Copastores |
| CD, arts. 10, 11 y 133 | «Plumas» en lugar de penas | Penas, reprensión e interdicción |
| CD, art. 28 | Detención del juez y alteración de las causas de recusación | Excusación o recusación; se restituye la ausencia de las sesiones |
| CD, art. 48, letra a | Omisión de la incorporación de todos los escritos | Expediente en orden cronológico con diligencias apropiadas |
| CD, art. 121 | «Pedido» en lugar de apelación | No aumentar la pena cuando solo apela el acusado |
| CD, nota 46 | Concilio del denunciante como destinatario en lugar del denunciado | Concilio del denunciado, por medio del concilio del denunciante |
| CD, nota 86 | «Niños» en lugar de sentencia y alteración de la notificación | Notificación efectiva y entrega de copia para iniciar el plazo |
| CD, nota 98 | Omisión del considerando a | Se restituye la referencia a la disciplina de oficiales |
| CD, nota 104 | Letra «y» en lugar de «e» | Se conserva la letra e y su mandato procedimental |
| CD, art. 32, § 2º | «poco probable» | Manifiestamente improcedente |
| EST-IPB, arts. 21, 22 y 34 | «Secretario de Estado» o «Secretario General» | Secretario Ejecutivo |
| EST-IPB, art. 37 | «Se ve» en lugar de prohibición | Se prohíbe a la Comisión Ejecutiva |
| EST-IPB, art. 38 | «Búsqueda» en lugar de poder | Poder para certificado digital |
| EST-IPB, art. 43 | «Fiscal» en lugar de apoderado | Apoderado designado |
| EST-SIN, art. 2, § 2º | Omisión de documentos de los representantes | Credenciales, informe, estadística y libro de actas |
| EST-SIN, art. 7 | Omisión de responsabilidad patrimonial | Se restituyen el encabezado y el § 1º completos |
| EST-SIN, art. 13 | «Secretario de Estado de Economía y Finanzas» | Secretario Ejecutivo |
| EST-SIN, art. 31 | Omisión de vigencia y salvaguardas | Entrada en vigor, derecho adquirido, cosa juzgada y acto jurídico perfecto |
| RI-CE, art. 16 | «Se ve» y «sellado» | Se prohíbe a la Comisión Ejecutiva; prohibición expresa |
| RI-CE, art. 22, § 1º | «Se concederá la lectura» | Se dispensará la lectura |
| RI-CE, art. 25, § 2º | Omisión de entes autónomos | Se restituyen entes autónomos y entidades paraeclesiásticas |
| RI-CE, art. 26, § 2º | Sujeto atribuido a la Comisión | Al ponente le corresponde encauzar el estudio, discusión y votación |
| RI-SC, art. 12, § 2º | «Se concederá la lectura» | Se dispensará la lectura |
| RI-SC, arts. 53 y 65 | «Fiscal» | Apoderado |
| RI-SC, art. 74, § 4º | «Enviará el proceso» | Ordenará archivar el proceso |
| RI-SC, art. 78, § 3º | Prórroga atribuida a los plazos del Código de Disciplina | Se exceptúan esos plazos; la prórroga se refiere a los demás |
| RI-SIN, art. 39 | «Receta orçada», pagos efectuados y escritura | Ingresos y pagos presupuestados; contabilidad |
| RI-SIN, art. 41, § 3º | Convocatoria y responsable desfigurados | El Secretario Ejecutivo expide la convocatoria por determinación del Presidente, con sus asuntos |
| RI-SIN, art. 49, § 3º | «Unión de la Ciudad» | Unión de la Juventud Presbiteriana (UMP) |
| RI-SIN, art. 85, § 1º | Condición para suspender la decisión alterada | Probabilidad de estimación del recurso y riesgo de daño grave |
| RI-SIN, art. 92, § 3º | Omisión de la excepción de plazos | Se exceptúan los plazos del Código de Disciplina |
| RI-SIN, nota 2 | «Aplicando lógicamente» | Aplicación por analogía de la regla de desempate |
| EST-PRE, art. 13 | Compromiso de aceptación reducido a aceptación | Se restituye el compromiso de aceptar doctrina, gobierno y disciplina |
| EST-PRE, art. 15, § 1º | «Si aceptará» y «exención» | No se acepta una solicitud de exoneración en el supuesto indicado |
| EST-PRE, art. 38 | «Hacer referencia» a la decisión | Convocar al Plenario para ratificar la decisión |
| EST-PRE, art. 50, § 1º | «Denuncia» para ambas comunicaciones | Queja del ofendido; denuncia de otra persona |
| EST-PRE, art. 54 | Aplicación del procedimiento sin limitación | Se restituye «en lo que resulte aplicable» |
| EST-PRE, nota 112 | «Manipulación financiera» | Movimiento financiero |
| EST-PRE, nota 135 | Actos y obligación de la persona jurídica invertidos | Los actos de los administradores obligan a la persona jurídica en los límites indicados |
| RI-PRE, arts. 59 y 90 | «Mayoría» o «mayorción» de la pena | Aumento de la pena |
| RI-PRE, art. 62, § 4º | Se rechaza la competencia y recurre al acusado | Rechazo de la alegación de incompetencia; el acusado puede recurrir |
| RI-PRE, art. 67, § 2º | «Si el ponente se gana» | Si el ponente queda en minoría |
| RI-PRE, art. 76, § 1º | Omisión de plazos sucesivos | Plazos sucesivos de tres días para acusación y defensa |
| RI-PRE, art. 95 | «Se sospecha» y excepción omitida | Se suspende; se exceptúan los plazos del Código de Disciplina |
| EST-IG, art. 13, § 1º | «Si aceptará» una solicitud de exclusión | No se acepta durante el proceso disciplinario |
| EST-IG, art. 21 | Urna, recuento y comprobación del quórum alterados | Se restituye la asamblea permanente y la condición del recuento |
| EST-IG, art. 30 | «Privadamente», «rechazarlas», «tijeras» | Exclusivamente; levantar penas; libros de tesorería |
| EST-IG, art. 49 | «Denuncia» para ambas comunicaciones | Queja del ofendido; denuncia de otra persona |
| EST-IG, art. 53 | «Plumas» | Penas |
| EST-IG, art. 56 | «En primer lugar» y «en segundo lugar» | Primera y segunda votación |
| RI-JD, art. 3 | «Votar y votar» | Votar y ser elegido |
| RI-JD, art. 5, inciso VI | «Reducirlas» a Tesorería | Entregar las cantidades recaudadas |
| RI-JD, art. 9 | «Arancel» y «plantones» | Orden del día y turnos de servicio |
| RI-JD, art. 13 | «Variancia», «vaciancia» y «oscilancia» | Vacancia |
| RI-JD, art. 17 | «Nota destinada» | Partida presupuestaria destinada |
| RI-JD, art. 34 | Confesión de Fe omitida | Se restituye dentro de los Símbolos de Fe |
| ATAS, art. 3 | Modelos de apertura y cierre desfigurados | Modelos completos con firmas y cierre al concluir el libro |
| ATAS, art. 6 | Negrita y subrayado confundidos y omitidos | Se restituyen los cuatro recursos de formato |
| ATAS, art. 8, § 3º | «Se podrá encadenar» | Se deberán encuadernar las páginas; espiral prohibida |
| ATAS, art. 11, § 2º | Sujeto de la firma e incorporación ambiguo | Acta de aprobación firmada por el Presidente e incorporada al libro |
| ATAS, nota 4 | Acceso a internet omitido; letras alteradas | Requisitos a), b), c) y d) completos |
| Sumario e índices | Títulos normativos y remisiones requerían revisión | Se traducen 331 entradas del sumario y todos los índices; se conservan anomalías del original con observaciones |
| Preliminares, p. 3 | «Billetes emisivos», presbiterios omitidos y competencia alterada | Notas remisivas, modelos de reglamentos de sínodos y presbiterios y competencia reservada al SC/IPB y a la CE-SC/IPB |
| Separadores, pp. 287, 335, 367, 451 y 533 | «Región interno» | Reglamento interno; se conservan las siglas |
| Preliminares, p. 2 | Nombres propios traducidos y columnas mezcladas | Nombres originales y créditos separados según la imagen del PDF |
| Preliminares, p. 4 | Duplicación del encabezado por extracción | Encabezado 4 MANUAL PRESBITERIANO verificado visualmente |
| Encabezado de ATAS | Título del Estatuto del Presbiterio en el documento independiente | Reglamento para la confección de actas de los concilios de la IPB |
| CI, nota 187 | Referencia introductoria truncada | Se restituye la instrucción de consultar el art. 40 y el art. 39 |
| CI, nota 189 | «Se pasa en silencio» | Se ora en silencio; el Presidente ora en voz audible |

Son correcciones del texto histórico de 2025, no reformas normativas de 2026.

## Alcance comprobable

Los controles mecánicos abarcaron las 1774 unidades: se conservan los marcadores de notas, los identificadores y la secuencia de las 560 páginas del anexo. No certifican que todas las frases tengan el mismo significado. El escaneo encontró {len(flags)} unidades con posibles residuos portugueses; algunos pueden ser nombres propios o citas y requieren evaluación individual.

El cotejo de las {len(reviews)} unidades siguientes se realizó con el texto portugués extraído del PDF original. No constituye certificación externa ni validación integral contra todas las imágenes del PDF.

| Identificador | Página PDF | Tipo |
| --- | --- | --- |
{rows}

## Uso en el sistema

El Markdown y los datos del proyecto declaran expresamente que la traducción no está aprobada como fuente definitiva. Los resultados y las exportaciones deben cotejarse con el PDF portugués. Los registros de revisión contienen huellas del texto original y de la traducción corregida para detectar cambios posteriores que invaliden ese cotejo.

El anexo tiene 560/560 páginas cotejadas y 0 pendientes; la nota 23 está completa en el cotejo acumulado. La nota 263 y el artículo 88 están completos; el artículo 114 continuaba en la página 141 y quedó completo en el lote 141–160. Todas las páginas cuentan con cotejo textual independiente registrado. Para leer la Constitución y el Código de Disciplina revisados debe usarse el archivo independiente o la sección estructurada del Manual. La aprobación como fuente definitiva no se ha registrado; el cotejo textual del asistente no es una certificación externa.

Las páginas 21–40 se leyeron íntegramente en portugués y español. Se verificaron visualmente las páginas 21, 27, 33 y 40 para confirmar discrepancias y límites. Las observaciones editoriales del lote señalan el inciso V impreso, la duplicación «art. art.», la discrepancia de fechas en la nota 38 y la repetición del punto 3 en la nota 52. El registro separado del anexo conserva huellas y versiones antes/después en `revision_anexo_paginas_manual.json` y `correcciones_revision_anexo_manual.json`.

Las páginas 41–60 se leyeron íntegramente en ambos idiomas; comprobación visual en 41, 48, 54, 55 y 60. Se completan la nota 66 y el artículo 17. Se conservan las particularidades del impreso, detalladas en los documentos del lote.

Las páginas 61–80 se leyeron íntegramente en ambos idiomas, con comprobación visual en 61, 65, 76, 79 y 80. Se completan la nota 122 y el artículo 34; la nota 263 y el artículo 88 están completos; el artículo 114 continuaba en la página 141 y quedó completo en el lote 141–160. Se conserva la repetición de la nota 148 y la remisión al artículo 4º de la nota 152, junto con las citas LXXIII/LXXIV en la nota 125.

Las páginas 81–100 se leyeron íntegramente en ambos idiomas, con comprobación visual en 81, 82, 86, 89, 97, 99 y 100. Se completan la nota 161 y el artículo 54; el texto del artículo 70 termina en 100, con nota 205 pendiente de 101. Se conservan las particularidades y referencias discrepantes descritas en las observaciones editoriales del lote.

Las páginas 101–120 se leyeron íntegramente en ambos idiomas, con comprobación visual en 105, 109, 113 y 120. Concluida la nota 205 en 102. En ese lote, la nota 263 y el artículo 88 continuaban en 121; ambos se completaron en el lote siguiente. Se conserva la discrepancia de fechas de cierre del año financiero en la nota 239.

Las páginas 121–140 se leyeron íntegramente en ambos idiomas, con comprobación visual en 123, 133, 137 y 140. Completas la nota 263 y el artículo 88; el artículo 114 continúa en 141. No queda una nota pendiente en el límite de 140. Se conservan las mayorías distintas en la nota 299 y las referencias discrepantes en la nota 321.

Las páginas 161–180 se cotejaron íntegramente con el texto portugués extraído del PDF. El índice de la Constitución queda completo. La nota 37 y el artículo 22 del Código de Disciplina continúan en 181. Se preservan las anomalías y citas históricas, incluidas las repeticiones de la nota 18 y las referencias de las notas 22 y 31.

Los detalles antes/después se conservan en `correcciones_revision_manual.json`; las señales automáticas, en `auditoria_revision_manual.json`. Ningún porcentaje de cobertura ni resultado de pruebas de software se interpreta como aprobación lingüística o normativa.
'''
(d/'revision_manual_2025_es.md').write_text(report)
translationreport=json.loads((d/'informe_traduccion_manual.json').read_text());translationreport.update(assistantTranslatedUnits=sum(r['id'] in json.loads((d/'traducciones_es.json').read_text()) for r in manual),automaticUnits=len(json.loads((d/'traducciones_automaticas_manual_es.json').read_text())),comparativelyReviewedUnits=len(reviews),approvedAsDefinitiveSource=False,pageAnnexComparedPages=c['metadata']['pageAnnexReviewProgress']['comparedPages'],pageAnnexAutomaticPages=c['metadata']['pageAnnexReviewProgress']['pendingPages'])
(d/'informe_traduccion_manual.json').write_text(json.dumps(translationreport,ensure_ascii=False,indent=2))
print({k:result[k] for k in ['integrityUnitsChecked','unitsIndividuallyComparedAndCorrected','candidatePortugueseResidueUnits','approvedAsDefinitiveSource']})
