"""Modelo histórico de Reglamento del Presbiterio: texto bilingüe y notas completas."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='RI-PRE'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text());headings=json.loads((d/'estructura_reglamento_presbiterio.json').read_text())
assert set(by)=={f'RI-PRE-art-{i}' for i in range(1,100)}|{f'RI-PRE-nota-{i}' for i in range(1,3)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest();assert re.findall(r'\[\d+\]',r['textOriginal'])==re.findall(r'\[\d+\]',r['textEs'])
for lang in ['pt','es']:
 es=lang=='es';parts=['# '+('Modelo de Reglamento Interno del Presbiterio' if es else 'Modelo de Regimento Interno do Presbitério')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo por el asistente: 99 artículos y 2 notas completas. Modelo histórico de 2025; no verifica reformas ni vigencia en 2026.\n\n' if es else '> Texto português extraído do Manual 2025: 99 artigos e 2 notas completas. Modelo histórico; denominação e sigla não preenchidas.\n\n'),'## Índice\n\n']
 for n,h in enumerate(headings):
  if h['labelPt'].startswith(('PARTE','LIVRO','TÍTULO')):parts.append(f'- [{h["labelEs" if es else "labelPt"]} — {h["titleEs" if es else "titlePt"]}](#RI-PRE-estrutura-{n})\n')
 parts.append('\n[Notas completas](#RI-PRE-notas)\n\n<a id="RI-PRE-encabezado"></a>\n## '+('REGLAMENTO INTERNO DEL PRESBITERIO (nombre y sigla)' if es else 'REGIMENTO INTERNO DO PRESBITÉRIO (nome e sigla)')+'[1](#RI-PRE-nota-1)\n\nPDF: 453\n')
 for i in range(1,100):
  for n,h in enumerate(headings):
   if h['article']!=i:continue
   level='####' if h['labelPt'].startswith('Seção') else '##';label=h['labelEs' if es else 'labelPt'];title=h['titleEs' if es else 'titlePt'];parts.append(f'\n<a id="RI-PRE-estrutura-{n}"></a>\n{level} {label}'+(' — '+title if title else '')+'\n')
  r=by[f'RI-PRE-art-{i}'];t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#RI-PRE-nota-{m[1]})',t);parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="RI-PRE-notas"></a>\n## Notas completas\n')
 for i in range(1,3):
  r=by[f'RI-PRE-nota-{i}'];parents=[a for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i==1:back='[Encabezado del modelo](#RI-PRE-encabezado)' if es else '[Cabeçalho do modelo](#RI-PRE-encabezado)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append('''\n## Observaciones editoriales

Estas observaciones no forman parte del Reglamento ni de sus notas.

- Se conservan los 99 artículos, las dos notas y la estructura de partes, libros, títulos, capítulos y secciones del modelo. El nombre y la sigla del Presbiterio no se completan. La nota 1 corresponde al encabezado; la nota 2 remite al art. 31, § 2º.
- El art. 6, § 8º, remite al «párrafo anterior». Se conserva esa referencia del original sin sustituirla por otra. El art. 31 presenta los incisos III y IV en una misma línea; se mantienen ambos contenidos.
- El art. 33, § 3º, remite a los incisos I a V para la sustitución del Presidente. El art. 25, § 3º, del modelo de Estatuto del Presbiterio remite a I a VI. Se conservan las formulaciones históricas sin armonizarlas editorialmente.
- Se preservan las mayorías y las excepciones de voto del art. 3 y el art. 27; el quórum de dos tercios de la Comisión Ejecutiva del art. 31; y la convocatoria con al menos siete días del art. 40, incluida la excepción de urgencia reconocida y unanimidad.
- «Comissão Executiva», «Secretário-Executivo» y «Tesoureiro» se traducen como «Comisión Ejecutiva», «Secretario Ejecutivo» y «Tesorero». «Sindicância» se traduce como «investigación preliminar»; «procurador», como «apoderado»; «acórdão», como «resolución colegiada». La suspensión del funcionamiento de un consejo del art. 81 corresponde a la interdicción del original.
- Se conservan los plazos sucesivos de los arts. 76, 77 y 85; las condiciones para suspender la eficacia de la decisión recurrida del art. 82; la ausencia de efecto suspensivo de la apelación del art. 87; y la excepción de los plazos establecidos por el Código de Disciplina en el art. 95, § 3º. La nota 2 conserva la aplicación por analogía de la regla de desempate del RI-CE, art. 19, § 3º.
- Veinte unidades cuyo original portugués coincide con unidades ya cotejadas de otros reglamentos reutilizan su traducción, ajustando únicamente el número inicial del artículo cuando corresponde. Se registra la procedencia en `reutilizacion_cotejo_ripre.json` y se comprueban las huellas del original y de la traducción final.
- Este cotejo del texto portugués extraído del PDF de 2025 fue realizado por el asistente; no constituye certificación externa ni comprobación de reformas de 2026. El anexo automático por páginas del Manual completo sigue pendiente de revisión.
''')
 text=''.join(parts);anchors=re.findall(r'<a id="([^"]+)"',text);assert len(anchors)==len(set(anchors));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='reglamento_presbiterio_2025_es_revisado.md' if es else 'regimento_presbiterio_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
print('RI-PRE: 99 artículos y 2 notas; huellas y enlaces comprobados.')
