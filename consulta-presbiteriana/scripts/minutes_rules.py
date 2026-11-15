"""Reglamento histórico de Actas: texto bilingüe y seis notas completas."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='ATAS'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text());headings=json.loads((d/'estructura_reglamento_actas.json').read_text())
assert set(by)=={f'ATAS-art-{i}' for i in range(1,25)}|{f'ATAS-nota-{i}' for i in range(1,7)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest();assert re.findall(r'\[\d+\]',r['textOriginal'])==re.findall(r'\[\d+\]',r['textEs'])
for lang in ['pt','es']:
 es=lang=='es';parts=['# '+('Reglamento para la confección de actas de los concilios de la IPB' if es else 'Regulamento para confecção de atas dos concílios da IPB')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo por el asistente: 24 artículos y seis notas completas. Texto histórico de 2025; no verifica reformas ni vigencia en 2026.\n\n' if es else '> Texto português extraído do Manual 2025: 24 artigos e seis notas completas. Texto histórico da edição 2025.\n\n'),'## Índice\n\n']
 for n,h in enumerate(headings):
  if h['labelPt'].startswith(('CAPÍTULO',)):parts.append(f'- [{h["labelEs" if es else "labelPt"]} — {h["titleEs" if es else "titlePt"]}](#ATAS-estrutura-{n})\n')
 parts.append('\n[Notas completas](#ATAS-notas)\n\n<a id="ATAS-encabezado"></a>\n## '+('REGLAMENTO PARA LA CONFECCIÓN DE ACTAS DE LOS CONCILIOS DE LA IPB' if es else 'REGULAMENTO PARA CONFECÇÃO DE ATAS DOS CONCÍLIOS DA IPB')+'[1](#ATAS-nota-1)\n\nPDF: 549\n')
 for i in range(1,25):
  for n,h in enumerate(headings):
   if h['article']!=i:continue
   level='####' if h['labelPt'].startswith('Seção') else '##';label=h['labelEs' if es else 'labelPt'];title=h['titleEs' if es else 'titlePt'];parts.append(f'\n<a id="ATAS-estrutura-{n}"></a>\n{level} {label}'+(' — '+title if title else '')+'\n')
  r=by[f'ATAS-art-{i}'];t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#ATAS-nota-{m[1]})',t);parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="ATAS-notas"></a>\n## Notas completas\n')
 for i in range(1,7):
  r=by[f'ATAS-nota-{i}'];parents=[a for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i==1:back='[Encabezado del modelo](#ATAS-encabezado)' if es else '[Cabeçalho do modelo](#ATAS-encabezado)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append("""
## Observaciones editoriales

Estas observaciones no forman parte del Reglamento ni de sus notas.

- Se conservan los 24 artículos, los cinco capítulos, las secciones y las seis notas completas de las páginas 549–559. La nota 1 corresponde al encabezado y conserva la aprobación mediante CE-SC/IPB – 2015 – DOC. CXV. Se conservan las decisiones de 2022 y 2025 que reproduce el original.
- Se restituyen los modelos de acta de apertura y acta de cierre del art. 3. El art. 3 habla de la primera página numerada; el art. 20 indica que las actas de apertura y cierre no se numeran. Ambas formulaciones se conservan sin armonizarlas editorialmente.
- En el art. 6, § 1º, el texto extraído contiene «A4 34 (210 x 297 mm)». Se conserva el «34» del material de partida, sin convertirlo en una remisión nueva. Se conservan todos los tamaños, márgenes y números del original. «Remalina» se traduce como «banda lateral perforada».
- Se conserva la exigencia de un solo párrafo y las instrucciones sobre líneas restantes de los arts. 5 y 6. El art. 18 permite dividir el contenido en asuntos bien definidos. Estas indicaciones se traducen sin atribuirles una modificación oficial ni añadir una interpretación sobre actas extensas.
- El art. 8, § 2º, exige que la última acta quede íntegramente dentro del libro; el § 3º exige encuadernación en rústica o similar y prohíbe la espiral. La nota 3 conserva que las actas de los concilios superiores no se numeran y deben referirse a la secuencia de reuniones ordinarias y extraordinarias.
- El art. 10 conserva las abreviaturas y siglas del original portugués con sus significados traducidos. La traducción no declara esas siglas oficiales del español. Se conservan el nombre de quien redactó, la identificación de quien transcribió y la firma que exige el § 9º; la nota 5 conserva la aclaración sobre el Secretario Ejecutivo y la referencia a la firma digital.
- El art. 12 conserva todos los datos de admisión, los actos pastorales, la transcripción de elecciones y la obligación de acta y libro específicos para asuntos disciplinarios. La nota 2 conserva los antecedentes y la decisión sobre el libro exclusivo del Tribunal.
- La nota 4 restituye los requisitos a), b), c) y d) completos para reuniones electrónicas, incluido el acceso de todos los miembros a internet. Se conservan tanto el domicilio de la sede del órgano como el enlace de acceso a la plataforma.
- Cotejo realizado por el asistente contra el texto portugués extraído del PDF de 2025, sin certificación externa. El anexo automático por páginas y el examen exhaustivo del Digesto siguen pendientes.
""")
 text=''.join(parts);anchors=re.findall(r'<a id="([^"]+)"',text);assert len(anchors)==len(set(anchors));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='reglamento_actas_2025_es_revisado.md' if es else 'regulamento_atas_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
print('ATAS: 24 artículos y seis notas; huellas y enlaces comprobados.')
