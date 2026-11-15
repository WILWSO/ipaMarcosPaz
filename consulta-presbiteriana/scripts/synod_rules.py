"""Modelo histórico de Reglamento del Sínodo: texto bilingüe y notas completas."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='RI-SIN'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text());headings=json.loads((d/'estructura_reglamento_sinodo.json').read_text())
assert set(by)=={f'RI-SIN-art-{i}' for i in range(1,97)}|{f'RI-SIN-nota-{i}' for i in range(1,3)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest();assert re.findall(r'\[\d+\]',r['textOriginal'])==re.findall(r'\[\d+\]',r['textEs'])
for lang in ['pt','es']:
 es=lang=='es';parts=['# '+('Modelo de Reglamento Interno del Sínodo' if es else 'Modelo de Regimento Interno do Sínodo')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo por el asistente: 96 artículos y 2 notas completas. Modelo histórico de 2025; no verifica reformas ni vigencia en 2026.\n\n' if es else '> Texto português extraído do Manual 2025: 96 artigos e 2 notas completas. Modelo histórico; denominação e sigla não preenchidas.\n\n'),'## Índice\n\n']
 for n,h in enumerate(headings):
  if h['labelPt'].startswith(('PARTE','LIVRO','TÍTULO')):parts.append(f'- [{h["labelEs" if es else "labelPt"]} — {h["titleEs" if es else "titlePt"]}](#RI-SIN-estrutura-{n})\n')
 parts.append('\n[Notas completas](#RI-SIN-notas)\n\n<a id="RI-SIN-encabezado"></a>\n## '+('REGLAMENTO INTERNO DEL SÍNODO (nombre y sigla)' if es else 'REGIMENTO INTERNO DO SÍNODO (nome e sigla)')+'[1](#RI-SIN-nota-1)\n\nPDF: 369\n')
 for i in range(1,97):
  for n,h in enumerate(headings):
   if h['article']!=i:continue
   level='####' if h['labelPt'].startswith('Seção') else '##';label=h['labelEs' if es else 'labelPt'];title=h['titleEs' if es else 'titlePt'];parts.append(f'\n<a id="RI-SIN-estrutura-{n}"></a>\n{level} {label}'+(' — '+title if title else '')+'\n')
  r=by[f'RI-SIN-art-{i}'];t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#RI-SIN-nota-{m[1]})',t);parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="RI-SIN-notas"></a>\n## Notas completas\n')
 for i in range(1,3):
  r=by[f'RI-SIN-nota-{i}'];parents=[a for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i==1:back='[Encabezado del modelo](#RI-SIN-encabezado)' if es else '[Cabeçalho do modelo](#RI-SIN-encabezado)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append('''\n## Observaciones editoriales

Estas observaciones no forman parte del Reglamento ni de sus notas.

- Se conservan los 96 artículos, las dos notas y la estructura de partes, libros, títulos, capítulos y secciones del modelo. El nombre y la sigla del Sínodo no se completan. La nota 1 corresponde al encabezado; la nota 2 remite al art. 31, § 2º.
- El art. 31, § 2º, exige la presencia mínima de dos tercios de los integrantes de la Comisión Ejecutiva. El art. 10 del modelo de Estatuto del Sínodo menciona la mayoría. Se conservan ambas formulaciones históricas sin armonizarlas editorialmente.
- El art. 44 dice que los miembros del Consejo Fiscal son elegidos «anualmente» para un mandato de dos años. Se mantiene esa combinación tal como figura en el original. Los arts. 55, § 3º, y 56 repiten el plazo de sesenta días para la investigación preliminar; se conserva la repetición.
- Se corrigen los términos financieros del art. 39, la convocatoria del art. 41 y las condiciones de las reuniones electrónicas del art. 43. «Comissão Executiva», «Secretário-Executivo» y «Tesoureiro» se traducen como «Comisión Ejecutiva», «Secretario Ejecutivo» y «Tesorero».
- «Sindicância» se traduce como «investigación preliminar»; «procurador», como «apoderado»; «interdição», como «interdicción»; y «acórdão», como «resolución colegiada». La nota 2 conserva la aplicación por analogía de la regla de desempate del RI-CE, art. 19, § 3º.
- Se conservan los plazos sucesivos de los arts. 75 y 87, las condiciones para suspender la eficacia de la decisión recurrida del art. 85, § 1º, y la excepción de los plazos establecidos por el Código de Disciplina en el art. 92, § 3º.
- Este es un cotejo del texto portugués extraído del PDF de 2025 realizado por el asistente. No constituye certificación externa ni comprobación de reformas de 2026. El anexo automático por páginas del Manual completo sigue pendiente de revisión.
''')
 text=''.join(parts);anchors=re.findall(r'<a id="([^"]+)"',text);assert len(anchors)==len(set(anchors));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='reglamento_sinodo_2025_es_revisado.md' if es else 'regimento_sinodo_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
print('RI-SIN: 96 artículos y 2 notas; huellas y enlaces comprobados.')
