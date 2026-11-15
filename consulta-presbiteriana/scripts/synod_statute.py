"""Modelo histórico de Estatuto del Sínodo, con sus 31 artículos y nueve notas."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='EST-SIN'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text())
assert set(by)=={f'EST-SIN-art-{i}' for i in range(1,32)}|{f'EST-SIN-nota-{i}' for i in range(1,10)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest();assert re.findall(r'_+',r['textOriginal'])==re.findall(r'_+',r['textEs']),r['id']
chapters={1:('I — Da denominação, sede, fins e duração','I — De la denominación, sede, fines y duración'),4:('II — Dos membros','II — De los miembros'),5:('III — Dos bens, direitos e obrigações','III — De los bienes, derechos y obligaciones'),8:('IV — Da administração, da representação e das reuniões','IV — De la administración, la representación y las reuniones'),27:('V — Das disposições finais e transitórias','V — De las disposiciones finales y transitorias')}
sections={8:('I — Da Comissão Executiva','I — De la Comisión Ejecutiva'),18:('II — Da Formação, Funcionamento e Atribuições','II — De la composición, el funcionamiento y las atribuciones'),22:('III — Do Conselho Fiscal','III — Del Consejo Fiscal'),24:('IV — Das Reuniões','IV — De las reuniones')}
for lang in ['pt','es']:
 es=lang=='es';idx=int(es);parts=['# '+('Modelo de Estatuto del Sínodo' if es else 'Modelo de Estatuto do Sínodo')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo completo por el asistente: 31 artículos y 9 notas. Modelo histórico de 2025; los espacios para completar se conservan. No verifica vigencia en 2026.\n\n' if es else '> Texto português extraído do Manual 2025: 31 artigos e 9 notas completas. Modelo histórico; espaços para preenchimento preservados.\n\n'),'## Índice\n\n[Encabezado y notas 1–2](#EST-SIN-encabezado) · [Notas completas](#EST-SIN-notas)\n\n' if es else '## Índice\n\n[Cabeçalho e notas 1–2](#EST-SIN-encabezado) · [Notas completas](#EST-SIN-notas)\n\n']
 for i,v in chapters.items():parts.append(f'- [{v[idx]}](#EST-SIN-capitulo-{i})\n')
 parts.append('\n<a id="EST-SIN-encabezado"></a>\n## '+('IGLESIA PRESBITERIANA DE BRASIL' if es else 'IGREJA PRESBITERIANA DO BRASIL')+'\n\nSÍNODO _______________________[1](#EST-SIN-nota-1)\n\nESTATUTO[2](#EST-SIN-nota-2)\n\nPDF: 357\n')
 for i in range(1,32):
  r=by[f'EST-SIN-art-{i}']
  if i in chapters:parts.append(f'\n<a id="EST-SIN-capitulo-{i}"></a>\n## Capítulo '+chapters[i][idx]+'\n')
  if i in sections:parts.append('\n#### '+('Sección ' if es else 'Seção ')+sections[i][idx]+'\n')
  t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#EST-SIN-nota-{m[1]})',t)
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="EST-SIN-notas"></a>\n## Notas completas\n')
 for i in range(1,10):
  r=by[f'EST-SIN-nota-{i}'];parents=[a for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i in [1,2]:back='[Encabezado del modelo](#EST-SIN-encabezado)' if es else '[Cabeçalho do modelo](#EST-SIN-encabezado)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append('''\n## Observaciones editoriales

Esta sección no forma parte del Estatuto ni de sus notas.

- Se conservan los 31 artículos y las 9 notas de las páginas PDF 357–366. Las notas 1 y 2 corresponden al nombre del Sínodo y al título «Estatuto», respectivamente. Se conservan las mismas secuencias de guiones bajos del modelo portugués; no se completan nombres, domicilios ni fechas.
- Se restituyen los requisitos del art. 2, § 2º (credenciales, informe, estadística y libro de actas), las reglas de responsabilidad y de no restitución del art. 7, y la vigencia y salvaguardas del art. 31, omitidos en la traducción automática anterior.
- «Secretário-Executivo» se traduce como «Secretario Ejecutivo»; «Tesoureiro», como «Tesorero»; «Comissão Executiva», como «Comisión Ejecutiva»; «autarquias», como «entes autónomos»; y «interdição», como «interdicción».
- El art. 18, § 2º, exige dos tercios de los presentes para modificar el Estatuto en reunión especialmente convocada. El art. 30 menciona voto secreto de dos tercios de los miembros del Sínodo y haber oído al Supremo Concilio o su CE. Se mantienen ambas formulaciones; no se armonizan mediante una modificación editorial.
- El art. 17 distingue la prohibición de legislar o revocar decisiones, la alteración por voto unánime en el supuesto allí indicado y la suspensión en casos especiales. No se añaden condiciones que el texto no exprese.
- La nota 2 conserva las decisiones históricas sobre el alcance de los modelos y el precedente de cambio de «Plenario» a «Asamblea General»; no se cambia con ese precedente todo el modelo. La nota 5 distingue la ayuda para gastos de los reembolsos por gastos comprobados con documentos fiscales válidos. La nota 6 conserva el límite de no alterar el sentido de las resoluciones al corregir su redacción.
- La nota 9 imprime «V» para la libertad de conciencia y de creencia. Se conserva el numeral tal como aparece en el Manual, sin atribuirle una corrección oficial. Se mantienen íntegros los textos legales reproducidos, sus fechas y elipsis. La frase irregular sobre el cisma total del art. 29 también conserva su contenido original.

El cotejo se realizó contra el portugués extraído del PDF de 2025. No constituye certificación externa ni verificación de reformas, vigencia en 2026 o adecuación de un estatuto concreto. El anexo automático por páginas del Manual completo sigue pendiente de revisión.
''')
 text=''.join(parts);anchors=re.findall(r'<a id="([^"]+)"',text);assert len(anchors)==len(set(anchors));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='estatuto_sinodo_2025_es_revisado.md' if es else 'estatuto_sinodo_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
print('EST-SIN: 31 artículos y 9 notas; espacios y enlaces comprobados.')
