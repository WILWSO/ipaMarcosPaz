"""Mantiene el avance a partir de los registros de cotejo."""
import json,collections,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rev=json.loads((d/'revision_semantica_manual.json').read_text());manual=[r for r in c['records'] if r['source']=='manual'];pl=c['metadata']['liturgyReviewProgress'];pending=[int(x.rsplit('-',1)[-1]) for x in pl['pendingIds']];counts=collections.Counter(r['norm'] for r in manual);comp=collections.Counter(r['norm'] for r in manual if r['id'] in rev)
text=f'''# Lista de trabajo — Manual Presbiteriano bilingüe

Actualizada: 14 de octubre de 2026. Documento editorial de seguimiento.

## Orden de trabajo

- [x] Constitución de 2025: preámbulo, 152 artículos y 361 notas cotejados.
- [x] Código de Disciplina: preámbulo, 135 artículos y 104 notas cotejados.
- [x] Principios de Liturgia: preámbulo y 44 artículos cotejados.
- [x] Terminar las notas de Liturgia: **{pl['comparedNotes']}/59 cotejadas; {len(pending)} pendientes**.
- [x] Estatuto de la IPB: texto introductorio, 47 bloques de artículos y 15 notas cotejados.
- [x] Reglamento Interno del Supremo Concilio: 82 artículos y 3 notas cotejados.
- [x] Reglamento Interno de la Comisión Ejecutiva: 37 artículos y 3 notas cotejados.
- [x] Modelo de Estatuto del Sínodo: 31 artículos y 9 notas cotejados.
- [x] Modelo de Reglamento Interno del Sínodo: 96 artículos y 2 notas cotejados.
- [x] Modelo de Estatuto del Presbiterio: 62 artículos y 135 notas cotejados.
- [x] Modelo de Reglamento Interno del Presbiterio: 99 artículos y 2 notas cotejados.
- [x] Renombrar Liturgia a `principios_liturgia_2025_es_revisado.md` y actualizar los enlaces.
- [x] Modelo de Estatuto de la Iglesia: 57 artículos y 116 notas cotejados.
- [x] Reglamento Interno de la Junta Diaconal: 34 artículos y una nota cotejados.
- [x] Reglamento para la confección de actas: 24 artículos y seis notas cotejados.
- [x] Incorporar las correcciones actuales al Manual español y al proyecto de consulta.
- [x] Cotejar las normas estructuradas del Manual, una sección a la vez.
- [x] Cotejar las páginas 1–4, los 13 separadores y las 19 páginas en blanco (36 registros OTROS).
- [x] Cotejar las 22 páginas del sumario y de los índices temáticos: 331 entradas del sumario y referencias históricas conservadas.
- [x] Mantener documentos de contenido y seguimiento en Markdown español y portugués.
- [x] Revisar el primer lote del anexo: páginas 1–20.
- [x] Revisar el segundo lote del anexo: páginas 21–40, concluyendo la nota 23.
- [x] Revisar el tercer lote del anexo: páginas 41–60, concluyendo la nota 66 y el artículo 17.
- [x] Revisar el cuarto lote del anexo: páginas 61–80, concluyendo la nota 122 y el artículo 34.
- [x] Revisar el quinto lote del anexo: páginas 81–100, concluyendo la nota 161 y el artículo 54.
- [x] Revisar el sexto lote del anexo: páginas 101–120, concluyendo la nota 205.
- [x] Revisar el séptimo lote del anexo: páginas 121–140, concluyendo la nota 263 y el artículo 88.
- [x] Revisar el octavo lote del anexo: páginas 141–160, concluyendo el artículo 114 y las normas de la Constitución.
- [x] Revisar el noveno lote del anexo: páginas 161–180, concluyendo el índice de la Constitución e iniciando el Código de Disciplina.
- [x] Revisar el décimo lote del anexo: páginas 181–200, concluyendo la nota 37 y el artículo 22 del Código de Disciplina.
- [x] Revisar el undécimo lote del anexo: páginas 201–220, concluyendo el Código de Disciplina y su índice.
- [x] Revisar el duodécimo lote del anexo: páginas 221–240, inicio de los Principios de Liturgia; nota 15 y artículo 11 continúan en 241.
- [x] Revisar el decimotercer lote del anexo: páginas 241–260, concluyendo la nota 15 y el artículo 11 de los Principios de Liturgia.
- [x] Revisar el decimocuarto lote del anexo: páginas 261–280, concluyendo los Principios de Liturgia y su índice e iniciando el Estatuto de la IPB hasta el artículo 29.
- [x] Revisar el decimoquinto lote del anexo: páginas 281–300, concluyendo el Estatuto e iniciando el Reglamento Interno del Supremo Concilio.
- [x] Revisar el decimosexto lote del anexo: páginas 301–320; Reglamento Interno hasta el artículo 58.
- [x] Revisar el decimoséptimo lote del anexo: páginas 321–340; Reglamento del Supremo Concilio completo; inicio RI-CE.
- [x] Revisar el decimoctavo lote del anexo: páginas 341–360; RI-CE completo e inicio del Estatuto del Sínodo.
- [x] Revisar el decimonoveno lote del anexo: páginas 361–380; Estatuto sinodal completo; Reglamento hasta artículo 30.
- [x] Revisar el vigésimo lote del anexo: páginas 381–400; Reglamento sinodal hasta artículo 60.
- [x] Revisar el vigésimo primer lote del anexo: páginas 401–420; Reglamento sinodal completo.
- [x] Revisar el vigésimo segundo lote del anexo: páginas 421–440; artículo 34 continuaba en 441, completado en el lote siguiente.
- [x] Revisar el vigésimo tercer lote del anexo: páginas 441–460; Estatuto del Presbiterio completo, sin continuaciones abiertas.
- [x] Revisar el vigésimo cuarto lote del anexo: páginas 461–480; artículo 51 continúa en 481.
- [x] Revisar el vigésimo quinto lote del anexo: páginas 481–500; artículo 85 continúa en 501.
- [x] Revisar el vigésimo sexto lote del anexo: páginas 501–520; artículo 24 EST-IG continúa en 521.
- [x] Revisar el vigésimo séptimo lote del anexo: páginas 521–540; artículo 12 RI-JD continúa en 541.
- [x] Completar el anexo: 560/560 páginas cotejadas; 0 pendientes.
- [x] Completar la traducción y el cotejo del Digesto español: 398/398 decisiones; revisión editorial final pendiente.
- [x] Cotejar cada resolución de 2026: efectos, vigencia documental, artículos y notas afectados.
- [x] Consolidar los efectos en suplemento separado PT/ES: 398/398.
- [ ] Completar la integración PT/ES: incluye seis enmiendas de SC-2026-CCI y una revocación parcial del RI-CE y la corrección del encabezamiento de Actas art. 3; 398/398 decisiones examinadas por sus efectos, 0 pendientes.
- [ ] Validar consultas bilingües de referencia y sus remisiones después de completar el corpus.
- [ ] Revisar conjuntamente los seis documentos y el proyecto.

## Aclaración sobre Liturgia

El preámbulo, los 44 artículos y las 59 notas tienen cotejo completo registrado. El archivo se renombra a `principios_liturgia_2025_es_revisado.md` para reflejar el cotejo completo de esta sección. El anexo por páginas tiene cotejo completo; las 398 decisiones de 2026 están examinadas por sus efectos; siguen pendientes las confirmaciones documentales y la edición definitiva.

## Siguiente paso concreto

El anexo está completo: **560/560 páginas**. Digesto: **398/398 decisiones traducidas y cotejadas**, 0 pendientes. Rastreo transversal cerrado: 142/142 candidatas clasificadas, 0 pendientes. Siguiente trabajo: confirmar los siete grupos documentales seleccionados; no es un inventario exhaustivo de relaciones implícitas. Suplemento consolidado: 398/398; edición definitiva pendiente.

El cotejo del anexo por páginas ya está completo; su armonización editorial con las unidades estructuradas queda para la revisión del conjunto. No se da por revisada una sección por tener traducción automática. La revisión del Digesto y la integración exhaustiva de 2026 se mantienen como pasos separados.

## Inventario del Manual

| Sección / identificador | Unidades cotejadas | Unidades totales | Estado |
| --- | ---: | ---: | --- |
'''
for norm,total in counts.items():text+=f'| {norm} | {comp[norm]} | {total} | '+('Cotejo completo' if comp[norm]==total else 'En curso' if comp[norm] else 'Pendiente')+' |\n'
text+=f'''\n**Total: {len(rev)}/{len(manual)} unidades cotejadas; {len(manual)-len(rev)} pendientes.** Los preámbulos se registran aparte. La traducción automática de cobertura integral del Manual no equivale a revisión completa.

## Entrega 22 — sumario e índices

Se cotejan las 22 páginas restantes: sumario (5–12), índice de la Constitución (157–163), del Código de Disciplina (213–217) y de Principios de Liturgia (265–266). Se traducen las 331 entradas del sumario y todos los asuntos y condiciones de los índices. Se conservan cifras, párrafos, incisos y anomalías del índice original, señaladas en observaciones editoriales. Los documentos independientes PT/ES se incorporan al Manual y al proyecto. También se generan seguimiento, informe de revisión y estado documental en ambos idiomas y en formato `.md`. **El inventario llega a 1774/1774 registros cotejados; quedan pendientes el anexo automático de 560 páginas, el Digesto español y la integración exhaustiva de 2026.**

El Manual español, la integración parcial, los datos del proyecto y los informes reflejan el avance real. `npm run documents` regenera documentos, auditoría y lista. Los controles de software, estructura y enlaces no certifican las traducciones pendientes.

Traducción no oficial, cotejada por el asistente en las unidades registradas, sin certificación externa. El Manual integrado todavía es parcial; el cotejo histórico no verifica vigencia en 2026. El anexo conserva los límites de página; ambos textos tienen cotejo registrado.

## Entrega 23 — anexo, páginas 1–20

Se cotejan las páginas 1–20, con documentos independientes `.md` en español y portugués. Se corrigen las traducciones del anexo y se verifican los límites y continuaciones de las notas 15 y 20. La nota 23 continúa en la página 21 y no se declara completa. Avance independiente del anexo: **20/560 páginas; 540 pendientes**. Siguiente lote: **21–40**.

## Entrega 24 — lote 24: páginas 21–40

Se cotejan las páginas 21–40 y se concluye la continuación de la nota 23. Se verifican las notas extensas sobre asambleas, bautismo y admisión de miembros. Las discrepancias y repeticiones del impreso se conservan, con observaciones editoriales en los documentos independientes PT/ES. Avance acumulado: **40/560 páginas; 520 pendientes**. La nota 66 y el artículo 17 continúan en la página 41; siguiente lote: **41–60**.

## Entrega 25: páginas 41–60

Cotejadas las páginas 41–60; completas la nota 66 y el artículo 17 en el anexo acumulado. Documentos Markdown en español y portugués, referencias y límites conservados. Avance: **60/560 páginas; 500 pendientes**. Próximo lote: **61–80**, continuación de la nota 122 y del artículo 34.

## Entrega 26: páginas 61–80

Cotejadas las páginas 61–80: sustento pastoral, licencias, jubilación y atribuciones de presbíteros y diáconos. Completos la nota 122 y el artículo 34 en el anexo acumulado. Conservadas las referencias y repeticiones del impreso, con observaciones editoriales. Markdown en español y portugués. Avance: **80/560 páginas; 480 pendientes**. Próximo lote: **81–100**, continuación de la nota 161 y del artículo 54.

## Entrega 27: páginas 81–100

Cotejadas las páginas 81–100: oficiales en disponibilidad, títulos eméritos, representación, recursos, elección de mesas y contribuciones conciliares. Completos la nota 161 y el artículo 54 en el anexo acumulado. El texto del artículo 70 termina en la página 100; su nota 205 continúa en la 101. Conservadas las particularidades del impreso, con observaciones editoriales. Markdown en español y portugués. Avance: **100/560 páginas; 460 pendientes**. Próximo lote: **101–120**, continuación de la nota 205.

## Entrega 28: páginas 101–120

Cotejadas las páginas 101–120: reuniones de concilios, quórum y atribuciones del Consejo y del Presbiterio. Concluida la nota 205 en la página 102. Conservadas las referencias, límites de página y discrepancias del impreso, incluida la fecha de cierre del año financiero de la nota 239. Markdown en español y portugués. Avance: **120/560 páginas; 440 pendientes**. Próximo lote: **121–140**, continuación de la nota 263 y del artículo 88.

## Entrega 29: páginas 121–140

Cotejadas las páginas 121–140: representación y atribuciones de concilios, comisiones ejecutivas, vocación y elección de oficiales. Completas la nota 263 y el artículo 88. Conservadas las discrepancias del impreso, incluidas las mayorías de la nota 299 y las referencias de la nota 321. Markdown en español y portugués. Avance: **140/560 páginas; 420 pendientes**. Próximo lote: **141–160**, continuación del artículo 114; ninguna nota pendiente en el límite de la página 140.

## Entrega 30: páginas 141–160

Cotejadas las páginas 141–160: candidatura, licenciatura y ordenación, relación pastoral, reformas constitucionales y comienzo del índice. Completos el artículo 114, las notas 322–361 y el texto normativo de la Constitución. Conservadas las referencias históricas discrepantes y las mayorías requeridas. Markdown en español y portugués. Avance: **160/560 páginas; 400 pendientes**. Próximo lote: **161–180**, continuación de la entrada Liturgia del índice; ninguna nota ni artículo normativo pendiente en el límite de la página 160.

## Entrega 31: páginas 161–180

Cotejadas las páginas 161–180: conclusión del índice de la Constitución, separadores y preámbulo del Código de Disciplina, faltas, penas, garantías procesales y tribunales. Conservadas las anomalías y citas históricas del impreso. Markdown en español y portugués. Avance: **180/560 páginas; 380 pendientes**. Próximo lote: **181–200**, continuaciones de la nota 37 y del artículo 22 del Código de Disciplina. La nota 37 no se declara completa en este lote.

## Entrega 32: páginas 181–200

Cotejadas las páginas 181–200: recusación e incompetencia, queja y denuncia, procedimiento persuasivo, registro de actas y expedientes, pruebas, citaciones, sentencias y comienzo del rito sumarísimo. Completos la nota 37 y el artículo 22 del Código de Disciplina. Conservadas las discrepancias de fechas y documentos del impreso. Markdown en español y portugués. Avance: **200/560 páginas; 360 pendientes**. Próximo lote: **201–220**, continuación de la nota 79. El artículo 97 está completo; la nota 79 no se declara completa en este lote.

## Entrega 33: páginas 201–220

Completos el Código de Disciplina y su índice. Revisados los recursos, ejecución y restauración; cerrada la nota 79. Avance: **220/560 páginas; 340 pendientes**. Próximo lote: **221–240**, Principios de Liturgia.

## Entrega 34: páginas 221–240

Cotejados el preámbulo y el inicio de los Principios de Liturgia: Día del Señor, templo, culto público, culto individual y doméstico y comienzo del bautismo de niños. Completos los artículos 7 y 8 y las notas 2, 3, 5, 7, 8, 9 y 11. La nota 15 y el artículo 11 continúan en 241 y no se declaran completos. Corregidos errores del español y conservadas las discrepancias del impreso. Avance: **240/560 páginas; 320 pendientes**. Próximo lote: **241–260**, continuación de la nota 15 y del artículo 11 de los Principios de Liturgia.

## Entrega 35: páginas 241–260

Cotejados bautismo, Santa Cena, bendición matrimonial, visitas a enfermos, funerales, ayuno, ordenación e instalación de oficiales y ministros y comienzo de la organización de iglesias. Completos la nota 15 y el artículo 11 de los Principios de Liturgia. La nota 50 continúa en 261 y el artículo 39 se reanuda en 262. Avance: **260/560 páginas; 300 pendientes**. Próximo lote: **261–280**.

## Entrega 36: páginas 261–280

Completos los Principios de Liturgia, su índice, la nota 50 y el artículo 39. Cotejado el comienzo del Estatuto de la IPB hasta el artículo 29: iglesias federadas, Supremo Concilio, miembros, Mesa Directora, secretarios y tesorero. Conservadas las notas de 2025 sobre atribuciones financieras. Sin continuaciones pendientes en el límite del lote. Avance: **280/560 páginas; 280 pendientes**. Próximo lote: **281–300**, artículo 30 del Estatuto de la IPB.

## Entrega 37: páginas 281–300

Completo el Estatuto de la IPB. Cotejado el inicio del Reglamento Interno del Supremo Concilio: órganos, reuniones, credenciales, elecciones, actas, documentos, orden parlamentario y comisiones. Conservados los dos artículos 44, Supremo Ejecutivo y las diferencias de quórum del impreso. El artículo 24 RI-SC continúa en 301. Avance: **300/560 páginas; 260 pendientes**. Próximo lote: **301–320**.

## Entrega 38: páginas 301–320

Cotejados votación, Mesa Directiva, secretarías, comisiones y procedimiento disciplinario. Artículo 24 completo; Reglamento Interno hasta el artículo 58. Conservada la numeración IV/V repetida del artículo 35. Sin continuaciones abiertas. Avance: **320/560 páginas; 240 pendientes**. Próximo lote: **321–340**, artículo 59 RI-SC.

## Entrega 39: páginas 321–340

Completo el Reglamento Interno del Supremo Concilio. Iniciado el Reglamento de la Comisión Ejecutiva. Conservados los plazos de aclaración de dos horas y cinco días, el cómputo en días hábiles y las referencias históricas. Artículo 8 RI-CE continúa en 341. Avance: **340/560 páginas; 220 pendientes**. Próximo lote: **341–360**.

## Entrega 40: páginas 341–360

Completo RI-CE; iniciado el Modelo de Estatuto del Sínodo. Conservadas las decisiones sobre unanimidad y prohibición de anular resoluciones del Supremo Concilio, los plazos documentales y la distinción entre ayuda para gastos y reembolsos. Artículo 13 EST-SIN continúa en 361. Avance: **360/560 páginas; 200 pendientes**. Próximo lote: **361–380**.

## Entrega 41: páginas 361–380

Completo el Modelo de Estatuto del Sínodo y su nota 9. Iniciado el Reglamento sinodal, hasta artículo 30. Conservados los quórums distintos de reforma en los artículos 18 y 30 del Estatuto y 3 del Reglamento, así como el inciso V de la transcripción constitucional. Sin continuaciones abiertas. Avance: **380/560 páginas; 180 pendientes**. Próximo lote: **381–400**, artículo 31 RI-SIN.

## Entrega 42: páginas 381–400

Reglamento sinodal cotejado hasta artículo 60: Comisión Ejecutiva, cargos, Consejo Fiscal, secretarías, procedimiento persuasivo, investigación preliminar y recursos. Conservada la elección anual del Consejo Fiscal con mandato de dos años y la repetición del plazo de sesenta días en artículos 55 y 56. Sin continuaciones abiertas. Avance: **400/560 páginas; 160 pendientes**. Próximo lote: **401–420**, artículo 61 RI-SIN.

## Entrega 43: páginas 401–420

Completo el Reglamento sinodal: Tribunal Pleno y de Recursos, plazos, sentencia, aclaración, representación y disposiciones finales. Conservadas las diferencias entre cumplimiento inmediato de la apelación y cumplimiento después de sentencia firme del Tribunal de Recursos. Sin continuaciones abiertas. Avance: **420/560 páginas; 140 pendientes**. Próximo lote: **421–440**, artículo 1 del Estatuto del Presbiterio.

## Entrega 44: páginas 421–440

Modelo de Estatuto del Presbiterio: identidad, miembros, ministros y representantes, órganos deliberativos, convocatoria, quórum, elecciones y cargos. Conservados los plazos, mayorías y referencias históricas, incluido artículo 4º en notas 15 y 76. Notas 36, 82 y 85 completas. El artículo 34 continúa en 441 y no se declara completo. Avance: **440/560 páginas; 120 pendientes**. Próximo lote: **441–460**, continuación del artículo 34.

## Entrega 45: páginas 441–460

Completo el Estatuto del Presbiterio, incluido el artículo 34 iniciado en 440 y las notas 112 y 135. Reglamento Interno del Presbiterio cotejado hasta artículo 15. Conservados los plazos disciplinarios, las remisiones históricas, la distinción de mayorías entre Estatuto y Reglamento y las actas por sesión. Sin continuaciones abiertas. Avance: **460/560 páginas; 100 pendientes**. Próximo lote: **461–480**, artículo 16 RI-PRE.

## Entrega 46: páginas 461–480

Reglamento del Presbiterio: comisiones, debate y votación, Comisión Ejecutiva, cargos, Consejo Fiscal, secretarías especiales y comunicación de faltas. Conservadas las condiciones de voto, mayorías, plazos de convocatoria y la nota 2 de 2024 sobre desempate. Artículo 48 completo en 478. El artículo 51 continúa en 481 y no se declara completo. Sin nota abierta. Avance: **480/560 páginas; 80 pendientes**. Próximo lote: **481–500**, continuación del artículo 51 RI-PRE.

## Entrega 47: páginas 481–500

Reglamento del Presbiterio: completo artículo 51 iniciado en 480; procedimiento persuasivo, investigación preliminar, recursos administrativos, Tribunal, defensa, prueba, sentencia y aclaración. Conservados la reserva de actas, los distintos plazos y condiciones de recurso y defensa, y la aprobación final sin modificar el fallo proclamado. El artículo 85 continúa en 501 y no se declara completo. Sin nota abierta. Avance: **500/560 páginas; 60 pendientes**. Próximo lote: **501–520**, continuación del artículo 85 RI-PRE.

## Entrega 48: páginas 501–520

Reglamento del Presbiterio completo, incluidos artículo 85 y libro de actas. Inicio del Modelo de Estatuto de la Iglesia Local: identidad, membresía, asambleas y Consejo. Nota 2 completa en 512, conservada como resolución histórica; plazos, quórums y condiciones de voto preservados. Artículo 24 continúa en 521 y no se declara completo. Sin nota abierta. Avance: **520/560 páginas; 40 pendientes**. Próximo lote: **521–540**, continuación del artículo 24 EST-IG.

## Entrega 49: páginas 521–540

Modelo de Estatuto de la Iglesia Local completo. Gobierno del Consejo, quórums, administración, cuentas, patrimonio y disciplina cotejados. Inicio del Reglamento de la Junta Diaconal: deberes, atribuciones y Mesa Directiva. Conservadas las resoluciones y referencias legales como documentación histórica del impreso de 2025. Artículo 12 RI-JD continúa en 541 y no se declara completo. Sin nota abierta. Avance: **540/560 páginas; 20 pendientes**. Próximo lote: **541–560**, continuación del artículo 12 RI-JD.

## Entrega 50: páginas 541–560

Reglamento de Junta Diaconal y Reglamento de Actas completos. Cerradas todas las continuaciones, incluida nota 5 ATAS en 557. Anexo: **560/560 páginas, 0 pendientes**. Cotejo textual completo por el asistente del Manual histórico 2025 y del anexo; sin certificación externa ni aprobación definitiva. Digesto español sigue en 1/398 y la integración de reformas es parcial. Próxima etapa: traducción y cotejo del Digesto 2026.

## Entrega 51: Digesto, primeras diez decisiones

Traducidas y cotejadas CCXLI–CCXXXII. Avance 11/398 decisiones traducidas; 387 pendientes de traducción. Constituyente del Código de Disciplina identificada como procedimiento pendiente; elecciones y nombramientos aprobados, sin reforma automática del Manual. Próximo lote desde SC-2026-CCXXXI.

## Entrega 52: Digesto, decisiones 11–20

Traducidas y cotejadas CCXXXI–CCXXII. Avance 21/398 decisiones traducidas, 20 cotejadas; 377 pendientes de traducción. Archivo FEP por pérdida de objeto y frase ambigua de CRIE conservados; sin integración automática de reformas. Próximo lote desde SC-2026-CCXXI, página 10.

## Entrega 53: Digesto, decisiones 21–30

Traducidas y cotejadas CCXXI–CCXII: nombramientos de ocho JURET, comisión de drogas y CM. Conservados nombres propios, referencia al art. 7º y mandatos hasta CE 2028. Avance 31/398 traducidas, 30 cotejadas; 367 pendientes de traducción. Próximo lote desde SC-2026-CCXI, página 13.

## Entrega 54: Digesto, decisiones 31–40

Traducidas y cotejadas CCXI–CCII. Nombramientos, propuestas rechazadas, inicio de trámite del art. 23 §2, estudio sobre art. 87 y rectificación sobre CCB diferenciados. Anomalías del original conservadas. Avance 41/398 traducidas, 40 cotejadas; 357 pendientes. Próximo lote desde SC-2026-CCI, página 27, ya traducida y pendiente de cotejo individual registrado.

## Entrega 55: Digesto, decisiones 41–50

CCI cotejada y nueve decisiones CC–CXCII traducidas y cotejadas. Votos y redacciones de EC 3–8 preservados; integración mantiene seis enmiendas. Nominaciones ya consideradas de Quinze de Novembro y Gammon diferenciadas de nuevas elecciones. Avance 50/398 traducidas, 50 cotejadas; 348 pendientes. Próximo lote desde SC-2026-CXCI, página 31.

## Entrega 56: Digesto, decisiones 51–70

Veinte decisiones CXCI–CLXXII traducidas y cotejadas. Reforma de educación teológica con transición, estructura y presupuesto de adolescentes, actas electrónicas e informes institucionales diferenciados; inconsistencias documentadas. Avance 70/398 traducidas y cotejadas; 328 pendientes. Próximo lote ampliado desde SC-2026-CLXXI, página 56. Integración mantiene seis enmiendas; nuevas reformas pendientes de integración.

## Entrega 57: Digesto, decisiones 71–90

Veinte decisiones CLXXI–CLII traducidas y cotejadas. Informes, cooperación académica, consultas doctrinales, extensiones condicionadas, presidencia de asambleas y recepción de miembros diferenciados. Numeración y anomalías preservadas. Avance 90/398 traducidas y cotejadas; 308 pendientes. Próximo lote desde SC-2026-CLI, página 78.

## Entrega 58: Digesto, decisiones 91–110

Veinte decisiones CLI–CXXXII traducidas y cotejadas: confesionalidad, contribuciones, Cena, protección de menores, competencias e informes misioneros y actas. Condiciones, remisiones y numeración conservadas. Avance 110/398 traducidas y cotejadas; 288 pendientes. Próximo lote desde SC-2026-CXXXI, página 104.

## Entrega 59: Digesto, decisiones 111–130

Veinte decisiones CXXXI–CXII traducidas y cotejadas: actas, culto, ministerios, historia, cosmovisiones, designaciones, disciplina y sociedades internas. Condiciones, excepciones y anomalías conservadas. Avance 130/398 traducidas y cotejadas; 268 pendientes. Próximo lote desde SC-2026-CXI, página 129.

## Entrega 60: Digesto, decisiones 131–150

Veinte decisiones CXI–XCII traducidas y cotejadas: fechas conmemorativas, CSM, accesibilidad, propuestas organizativas y actas sinodales. Revocaciones, condiciones y correcciones obligatorias preservadas. Avance 150/398 traducidas y cotejadas; 248 pendientes. Próximo lote desde SC-2026-XCI, página 151.

## Entrega 61: Digesto, decisiones 151–170

Veinte decisiones XCI–LXXII traducidas y cotejadas: actas e informes sinodales, elecciones, firmas, sesiones y correcciones estadísticas. Anomalías, períodos y alcance de aprobaciones preservados. Avance 170/398 traducidas y cotejadas; 228 pendientes. Próximo lote desde SC-2026-LXXI, página 171.

## Entrega 62: Digesto, decisiones 171–190

Veinte decisiones LXXI–LII traducidas y cotejadas: aprobación de actos, correcciones de actas, continuidad administrativa, tribunales, cuentas y personalidad jurídica. Condiciones, plazos y anomalías preservados. Avance 190/398 traducidas y cotejadas; 208 pendientes. Próximo lote desde SC-2026-LI, página 192.

## Entrega 63: Digesto, decisiones 191–210

Veinte decisiones LI–XXXII traducidas y cotejadas: actas e informes sinodales, estadísticas, liderazgo, planificación y correcciones expresas. Repeticiones, datos incompletos, numeración y condiciones preservados. Avance 210/398 traducidas y cotejadas; 188 pendientes. Próximo lote desde SC-2026-XXXI, página 215.

## Entrega 64: Digesto, decisiones 211–230

Veinte decisiones XXXI–XII traducidas y cotejadas: actas e informes, recursos, correcciones estadísticas y registros sinodales. Tropical sin aprobación expresa y Costa do Sol con rechazo financiero diferenciados. Avance 230/398 traducidas y cotejadas; 168 pendientes. Próximo lote desde SC-2026-XI, página 239.

## Entrega 65: Digesto, decisiones 231–250

Ocho decisiones SC XI–IV y doce CE CLXIII–CLII traducidas y cotejadas completas: comisiones, jubilación, reelección, siglas, oficios, presupuesto, contratos y patrimonio. Estudios, negativas y autorizaciones condicionadas diferenciados. Avance 250/398 traducidas y cotejadas; 148 pendientes. Próximo lote desde CE-2026-CLI, página 258.

## Entrega 66: Digesto, decisiones 251–260

Diez decisiones CE CLI–CXLII traducidas y cotejadas completas: garantías, patrimonio, presupuestos, boleto de diezmo y cartas-voto. Estudios y remisiones distinguidos de autorizaciones. Avance 260/398 traducidas y cotejadas; 138 pendientes. Próximo lote desde CE-2026-CXLI, página 262.

## Entrega 67: Digesto, decisión 261

Decisión CE-CXLI completa: modificación estatutaria IBN, considerandos, adecuaciones y consolidación de 31 artículos. Cuórums, competencias, responsabilidad y condiciones de vigencia preservados. Avance 261/398 traducidas y cotejadas; 137 pendientes. Próximo lote desde CE-2026-CXL, página 273.

## Entrega 68: Digesto, decisiones 262–271

Diez decisiones CE CXL–CXXXI completas: recursos, elecciones, publicaciones, modificación parcial de resoluciones y patrimonio. Admisibilidad, estudios y formalización diferenciados. Avance 271/398 traducidas y cotejadas; 127 pendientes. Próximo lote desde CE-2026-CXXX, página 283.

## Entrega 69: Digesto, decisiones 272–281

Diez decisiones CE CXXX–CXXI completas: informes, nominaciones, archivos, seminario y misión. Cifras discrepantes y alcance de remisiones preservados. Avance 281/398 traducidas y cotejadas; 117 pendientes. Próximo lote desde CE-2026-CXX, página 292.

## Entrega 70: Digesto, decisiones 282–291

Diez decisiones CE CXX–CXI completas: cooperación, tecnología, atribuciones conciliares y misión. Planes, estudios, membresía, voz y voto diferenciados. Avance 291/398 traducidas y cotejadas; 107 pendientes. Próximo lote desde CE-2026-CX, página 300.

## Entrega 71: Digesto, decisiones 292–311

Veinte decisiones CE CX–XCI completas: consultas, disciplina, reglamento de actas y registros presbiteriales. Aclaración, modificación aprobada y anteproyecto diferenciados. Avance 311/398 traducidas y cotejadas; 87 pendientes. Próximo lote desde CE-2026-XC, página 309.

## Entrega 72: Digesto, decisiones 312–331

Veinte decisiones CE XC–LXXI completas: sínodos, estatutos, comodato e informes contables. Condiciones registrales y exceso sin aprobación previa preservados. Avance 331/398 traducidas y cotejadas; 67 pendientes. Próximo lote desde CE-2026-LXX, página 320.

## Entrega 73: Digesto, decisiones 332–351

Veinte decisiones CE LXX–LI completas: cuentas, recurso Guará, expedientes pendientes y jubilaciones. Excepciones y ausencia de juicio de mérito preservadas. Avance 351/398 traducidas y cotejadas; 47 pendientes. Próximo lote desde CE-2026-L, página 332.

## Entrega 74: Digesto, decisiones 352–371

Veinte jubilaciones CE L–XXXI completas con historial, familias y distinciones. Bases específicas, ausencia de cargas IPB y anomalías originales preservadas. Avance 371/398 traducidas y cotejadas; 27 pendientes. Próximo lote desde CE-2026-XXX, página 342.

## Entrega 75: Digesto, decisiones 372–391

Veinte jubilaciones CE XXX–XI completas con historial, familias y distinciones. Cifras y cronologías incompatibles conservadas sin conjeturas. Avance 391/398 traducidas y cotejadas; 7 pendientes. Próximo lote desde CE-2026-X, página 352.

## Entrega 76: cierre del Digesto, decisiones 392–398

Siete decisiones CE X–IV completas: jubilaciones, reforma de sentencia, restauraciones y exoneraciones. Variantes de nombres y cierre editorial conservados. Avance 398/398 traducidas y cotejadas; 0 pendientes. Traducción del Digesto concluida; integración normativa, revisión editorial y aprobación definitiva pendientes. Siguiente fase: integración y revisión final.

## Entrega 77: integración normativa prioritaria 01

Diez decisiones con efectos cotejados: 10/398 examinadas, 388 pendientes de examen normativo. Se mantienen las seis EC 3–8; integrado el retiro del inciso X del cuerpo principal del RI-CE art. 8 (SC-CXXIII), conservando el inciso X del párrafo único. CE-CXIX identificada como revocada por SC-CIX. Orientaciones de actas/asambleas y procedimientos pendientes anotados sin convertir propuestas en normas. Remisión de aprobación de actas corregida de art. 13 a arts. 10 y 6. Digesto traducido y cotejado: 398/398. Siguiente examen: restantes decisiones desde SC-2026-CCXLI; prioridad a la corrección puntual de Actas art. 3 y reglamentos con transición.

## Entrega 78: integración normativa 02

Veinte decisiones examinadas: diecinueve SC CCXLI–CCXXII (excluye SC CCXXXIX, ya examinada) y CE CII. Actualizado el encabezamiento de Actas art. 3 para términos de apertura y cierre sin numeración, conservando §§ 1–3 y señalando sus modelos históricos. Dieciséis nombramientos/nominaciones, archivo FEP, identidad visual UCP y Proyecto Alagoas registrados sin insertarlos como reformas de artículos. Expedientes PT/ES separados. Avance normativo 30/398; 368 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-CCXXI.

## Entrega 79: integración normativa 03

Veinte decisiones SC CCXXI–CXCIX examinadas, omitiendo las ya revisadas. Quince nombramientos o nominaciones, dos propuestas rechazadas, rechazo y estudio sobre representación, decisión específica sobre CCB y propuesta prematura del anteproyecto del Código de Disciplina. Anotaciones vinculadas sin nuevas sustituciones de artículos. Plazos JURET individuales y referencias divergentes SC-2022-XX/Doc. 064 conservados. Avance normativo 50/398; 348 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-CXCVIII.

## Entrega 80: integración normativa 04

Veinte decisiones SC CXCVIII–CLXXVIII examinadas, omitiendo SC CLXXXI ya revisada. Seis nombramientos/elecciones, tres documentos sin objeto, ocho informes y decisiones sobre reglamento educativo, himno UPA y estructura/presupuesto SNTA. Educación teológica: 29 ajustes a–cc, revocación RI-JET y transición hasta SC 2030 delimitados; texto base integral ausente identificado. SNTA: cinco orientadores sujetos a aprobación CE y participación 0,28% a 1,0%, sin presumir ejecución. Apuntes PT/ES separados; artículos históricos conservados. Avance normativo 70/398; 328 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-CLXXVII.

## Entrega 81: integración normativa 05

Veinte decisiones SC CLXXVII–CLVIII examinadas. Once informes con observaciones y encargos, dos cooperaciones académicas CPAJ, rechazo de modificación del Credo, comisiones de estudio, remisión ECA, recepción específica IASD y dos extensiones de seminarios. Condiciones de firma, becas, costeo y supervisión preservadas; no se presume ejecución. Apuntes y vínculos sin nuevas sustituciones de artículos. Avance normativo 90/398; 308 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-CLVII.

## Entrega 82: integración normativa 06

Veinte decisiones SC CLVII–CXXXVII examinadas, excluyendo CLIV ya revisada. Seminarios condicionados, consultas doctrinales y de membresía, Santa Cena con jugo de uva admitido, protección de menores, presupuestos e informes misioneros diferenciados. Discrepancias CI art. 18 y EST-SIN art. 5 señaladas; apuntes PT/ES sin nuevas sustituciones de artículos. Avance normativo 110/398; 288 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-CXXXVI.

## Entrega 83: integración normativa 07

Veinte decisiones SC CXXXVI–CXVI examinadas, excluyendo CXXIII ya revisada. Informes misioneros/Tesorería, seis libros CE con observaciones, culto público y enseñanza, recurso y revocación rechazados, carnaval, cosmovisiones, indicaciones, casamientos, homenajes, disolución pastoral y maledicencia digital. Límites y discrepancias preservados; sin nuevas sustituciones de artículos. Avance normativo 130/398; 268 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-CXV.

## Entrega 84: integración normativa 08

Veinte decisiones SC CXV–XCV examinadas, excluyendo CIX ya revisada. Orientación Legendários, propuestas de sociedades/secretarías, formación de presbíteros, espacio de eventos en estudio, consejo de acogimiento con encargos y dos fechas de calendario. Diez exámenes sinodales con observaciones; actas por sesión, correcciones, privacidad y nulidad SBB delimitados. Sin nuevas sustituciones de artículos. Avance normativo 150/398; 248 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-XCIV.

## Entrega 85: integración normativa 09

Veinte decisiones SC XCIV–LXXV examinadas: actas, actos e informes sinodales. Planalto y Central de Brasília: corrección preservando originales y reenvío en 60 días para CE 2027. Sergipe 66→4 y Paraíba 321→47; Rio Grande do Norte sin cifra nueva fijada. Acta preparatoria única compatible con actas por sesión regular; organización 2024 diferenciada de corrección material 2025. Referencias y discrepancias conservadas; sin nuevas sustituciones de artículos. Avance normativo 170/398; 228 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-LXXIV.

## Entrega 86: integración normativa 10

Veinte decisiones SC LXXIV–LV examinadas. Sudoeste de Goiás debe rehacer libro para CE 2027; Limeira: continuidad, ratificación de actos, Tribunal y UPH. Piratininga: renta bienal R$ 22.480,05→R$ 19.480,05. Paulistano: tesorería subordinada, regularización y acta extraordinaria en 60 días o justificación. Nova Iguaçu: aprobación plenaria de estatuto pendiente. Numeración, referencias, firmas, alineación y datos fiscales preservados con límites; sin nuevas sustituciones de artículos. Avance normativo 190/398; 208 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-LIV.

## Entrega 87: integración normativa 11

Veinte decisiones SC LIV–XXXV examinadas. Informes faltantes, plazos sinodales anteriores, Tribunal, nombres/quórum, corrección de encabezamiento, planificación y privacidad delimitados. Referencias CD 26/25 y reglamentos cotejadas sin sustitución silenciosa; escaneo cortado y campos vacíos no reconstruidos. Actos aprobados y mero conocimiento de informes diferenciados; sin nuevas sustituciones de artículos. Avance normativo 210/398; 188 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-XXXIV.

## Entrega 88: integración normativa 12

Veinte decisiones SC XXXIV–XV examinadas. Diecinueve aprobaciones con observaciones y Tropical pendiente de corrección/examen. Totales +183/+43, autos de corrección y envíos de 30 días registrados; acta XVI indicada sin extender orden a XVIII. Setentrional, Marco Zero y Leste/Norte Fluminense conservan divergencias; comisión especial diferenciada de Tribunal y conocimiento de sentencia de nueva condena. Sin nuevas sustituciones de artículos. Avance normativo 230/398; 168 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde SC-2026-XIV.

## Entrega 89: integración normativa 13

Veinte decisiones SC XIV–IV y CE CLXIII–CLV examinadas. Informes, segregación fiscal, comisión de drogas, jubilados, reelección, siglas y orientaciones doctrinales distinguidos; presupuesto y contratos autorizados sin presumir ejecución. Estudios de obras, Caiuá, Projeto Vida y TV; INSS remitido. Donación IPN condicionada y revocación externa parcial CE2022-CLV registradas. Sin nuevas sustituciones de artículos. Avance normativo 250/398; 148 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-CLIV.

## Entrega 90: integración normativa 14

Veinte decisiones CE CLIV–CXXXV examinadas. Actos patrimoniales y estudios diferenciados de ejecución; estatuto IBN completo conservado con adecuaciones y límites. Prórroga de cartas-voto CD, recursos administrativos, comunicación previa de plantación e iCalvinus documentados. Libros digitales sujetos a estudio; revocaciones externas parciales de 2025 y remisión GTSI sin reforma aprobada. Sin nuevas sustituciones de artículos. Avance normativo 270/398; 128 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-CXXXIII.

## Entrega 91: integración normativa 15

Veinte decisiones CE CXXXIII–CXIV examinadas. Incorporación HERV y cierre Cidade Mackenzie con encargos pendientes; informes, nombramientos y comodato diferenciados. Estudios CPSS, PBET, Angola y estadística; lanzamiento JMN autorizado. CE-CXIX conservada como antecedente revocado por SC-CIX. Interpretaciones sobre poderes de transferencia y palabra del emérito sin voto; discrepancia CI88 l/c señalada. CESEPPI devuelta y ECA remitida sin mérito. Sin nuevas sustituciones de artículos. Avance normativo 290/398; 108 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-CXIII.

## Entrega 92: integración normativa 16

Veinte decisiones CE CXIII–XCII examinadas, excluyendo CIII/CII ya revisadas. Repase mensual APMT ordenado sin adjudicación expresa de indemnizaciones; carta CI125 de jurisdicción y procedimientos SAF diferenciados. Remisiones al SC y consulta FAP sin mérito. Sustento disciplinar facultativo, sin pago automático ni límite de un año tomado de propuesta. Diez registros presbiteriales con siglas condicionadas y datos históricos conservados. Sin nuevas sustituciones de artículos. Avance normativo 310/398; 88 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-XCI.

## Entrega 93: integración normativa 17

Veinte decisiones CE XCI–LXXII examinadas. Registros presbiteriales, fusión PCEC y creación de cuatro sínodos con comisiones especiales diferenciados de ejecución. Estatutos Erasmo Braga/APMT, comodato Palmas y minutas SAC/SCH/SCI con alcance específico. Informes contables aprobados sin certificación independiente; IBAA sin mérito por competencia. Exceso CE2025 de 44,59% y falta de aprobación previa JPEF conservados; siglas PRCV/PRER frente a PBCV/PBER señaladas. Sin nuevas sustituciones de artículos. Avance normativo 330/398; 68 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-LXXI.

## Entrega 94: integración normativa 18

Veinte decisiones CE LXXI–LII examinadas. Informes aprobados con controles; Noroeste pendiente, sin aprobación de cuentas, y 60 días para examen. Guará: transferencias y disolución anuladas, Eixo Sul válido, traslado PRGU ordenado. Coletivo suspendido sin mérito, Imperatriz remitida y difusión de carta litúrgica existente. Indicaciones JURETs remitidas con excepción Recife de dos años; siete jubilaciones individuales sin carga IPB. Sin nuevas sustituciones de artículos. Avance normativo 350/398; 48 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-LI.

## Entrega 95: integración normativa 19

Veinte decisiones CE LI–XXXII examinadas: jubilaciones individuales sin carga IPB y honores. Referencias CI49 distintas conservadas; discrepancia de edad Valnei, trayectoria incompleta José Apolinário, numeración y datos biográficos señalados sin correcciones por suposición o declaración de invalidez. Sin nuevos beneficios nacionales, voto general o sustitución de artículos. Avance normativo 370/398; 28 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-XXXI.

## Entrega 96: integración normativa 20

Veinte decisiones CE XXXI–XII examinadas: jubilaciones individuales sin carga IPB y honores. Referencias CI49 conservadas; discrepancias de edades Eudes/Antônio Célio, trayectoria Edilaney y cronología Anderson señaladas sin sustituir datos o declarar invalidez. Variantes nominales, geografía y biografía preservadas. Sin beneficios nacionales nuevos, voto general o sustitución de artículos. Avance normativo 390/398; 8 pendientes. Digesto traducido y cotejado 398/398. Próximo examen desde CE-2026-XI.

## Entrega actual — lote 97: cierre del examen normativo

Últimas ocho decisiones CE XI–IV examinadas: jubilaciones, sentencia reformada, restauraciones y bajas CI48 a/b/c diferenciadas. Variantes nominales y terminológicas conservadas sin fusionar personas o atribuir condenas no documentadas. Se completa examen documental de efectos: 398/398; 0 pendientes. Digesto traducido y cotejado 398/398. Sin nuevas sustituciones de artículos. Próxima fase: consolidación y revisión editorial final; no hay certificación externa o aprobación definitiva de la edición española.

## Entrega actual — lote 98: consolidación y control editorial

Suplementos español y portugués con las 398 decisiones y sus efectos, límites, fuentes y hashes. Se conservan los 21 dossiers históricos. Corregidos los informes actuales desactualizados y la traducción de CI, nota 259, con registro del cambio. Nueve señales São clasificadas como nombres propios. La revisión editorial definitiva sigue pendiente: compatibilidad de notas históricas con las reformas, bases normativas no suministradas y divergencias de fechas, nombres o siglas. Véase revision_editorial_consolidacion_2026_es.md.

## Entrega actual — lote 99: compatibilidad de notas históricas

Ocho artículos modificados y sus 25 notas directas examinados, con cotejo de EST-IG art.28 y ATAS art.20. Advertencias específicas sobre pastor emérito, elección anual y pluralidad de tesoreros, plazos de recurso y distinción entre presbítero y diácono en disponibilidad. Textos documentales conservados; no se declara revocación integral de notas por inferencia. Siguiente: referencias transversales en las demás notas y confirmación de las divergencias.

## Entrega actual — lote 100: primer cotejo transversal

Rastreo reproducible de 816 notas; 25 directas ya examinadas y 791 elegibles para rastreo transversal. Cotejado el texto completo de 20 notas en su relación con las reformas de 2026. Advertida la remisión histórica de recursos en 90 días frente al nuevo plazo de 30 días, sin sustituir los 90 días de interposición ni los plazos judiciales. Conservadas las citas antiguas sobre emerencia y la remisión in fine del art.27 con advertencias específicas. Demás candidatas automáticas pendientes de clasificación; no son incompatibilidades confirmadas.

## Entrega actual — lote 101: referencias a otros dispositivos

Identificadas 40 candidatas que remiten a dispositivos distintos de los reformados: Código Civil, Código de Disciplina, Liturgia, Constitución arts.3/8 y modelos estatutarios o reglamentarios. Acumuladas 60 candidatas clasificadas de 142; 82 pendientes. La clasificación no demuestra vigencia general ni ausencia de relaciones implícitas. Ningún texto normativo sustituido; los modelos históricos no se equiparan automáticamente a los actuales. Siguiente: demás competencias presbiteriales, representación, comisiones y Secretaría Ejecutiva.

## Entrega actual — lote 102: competencias y representación

Cotejadas otras 30 notas transversales completas, con EC3/7/8 y aclaraciones CE2026-CIV/CXII/CXXXVIII. Distinguidos candidatura, ministerio ordenado, elección/designación, representación/ex officio, sustento en afastamento/deposición y comunicación en plantación. Acumuladas 90/142 candidatas clasificadas: 50 relaciones con reformas y 40 otros dispositivos; 52 pendientes. Compatibilidad del voto específico de jubilado sin representación pendiente de confirmación; datos fiscales históricos sin actualización.

## Entrega actual — lote 103: Secretaría Ejecutiva y disponibilidad

Otras 24 notas examinadas. Separados archivo histórico, correspondencia, corrección redaccional y firma; voto en Plenario, Ejecutiva y comisiones; mandato del Consejo local y de la Mesa presbiterial. Revocación limitada al inciso X principal de RI-CE8; inciso XI del párrafo único preservado. Acumuladas 114/142 candidatas clasificadas, 28 pendientes. Compatibilidad del voto del jubilado permanece abierta; no se declara reformado el RI-SE sin su base integral.
## Entrega actual — lote 104: cierre del rastreo

28 notas de Liturgia, Disciplina, candidaturas y seminarios examinadas. Clasificadas 142/142 candidatas, 0 pendientes del rastreo. No equivale a compatibilidad global definitiva. Confirmaciones documentales organizadas en siete grupos seleccionados, separados de las normas, con fuentes y criterios de confirmación. Véase pendientes_confirmacion_documental_2026_es.md.

'''
text += '\n## Entrega actual — revisión de las confirmaciones: siete grupos examinados; P02 cerrado por cotejo textual y P05 por localización del RI-SE; cinco grupos con cuestiones abiertas, tres con avances parciales. La lista de documentos necesarios está en pendientes_confirmacion_documental_2026_es.md. Sin aprobación oficial.\n'
name='lista_trabajo_manual_presbiteriano.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name);print(f'Lista: {len(rev)} unidades cotejadas; {len(pending)} notas PL pendientes.')

