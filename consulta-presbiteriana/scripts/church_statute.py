"""Modelo histórico de Estatuto de la Iglesia: texto bilingüe y notas completas."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='EST-IG'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text());headings=json.loads((d/'estructura_estatuto_iglesia.json').read_text())
assert set(by)=={f'EST-IG-art-{i}' for i in range(1,58)}|{f'EST-IG-nota-{i}' for i in range(1,117)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest();assert re.findall(r'\[\d+\]',r['textOriginal'])==re.findall(r'\[\d+\]',r['textEs'])
for lang in ['pt','es']:
 es=lang=='es';parts=['# '+('Modelo de Estatuto de la Iglesia' if es else 'Modelo de Estatuto da Igreja')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo por el asistente: 57 artículos y 116 notas completas. Modelo histórico de 2025; no verifica reformas ni vigencia en 2026.\n\n' if es else '> Texto português extraído do Manual 2025: 57 artigos e 116 notas completas. Modelo histórico; nome e endereço não preenchidos.\n\n'),'## Índice\n\n']
 for n,h in enumerate(headings):
  if h['labelPt'].startswith(('CAPÍTULO',)):parts.append(f'- [{h["labelEs" if es else "labelPt"]} — {h["titleEs" if es else "titlePt"]}](#EST-IG-estrutura-{n})\n')
 parts.append('\n[Notas completas](#EST-IG-notas)\n\n<a id="EST-IG-encabezado"></a>\n## '+('ESTATUTO DEL PRESBITERIO — ______________________________ (insertar nombre y sigla de la Iglesia)' if es else 'ESTATUTO DA IGREJA PRESBITERIANA — ______________________________ (nome da Igreja)')+'[1](#EST-IG-nota-1)\n\nPDF: 511\n')
 for i in range(1,58):
  for n,h in enumerate(headings):
   if h['article']!=i:continue
   level='####' if h['labelPt'].startswith('Seção') else '##';label=h['labelEs' if es else 'labelPt'];title=h['titleEs' if es else 'titlePt'];parts.append(f'\n<a id="EST-IG-estrutura-{n}"></a>\n{level} {label}'+(' — '+title if title else '')+'\n')
  r=by[f'EST-IG-art-{i}'];t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#EST-IG-nota-{m[1]})',t);parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="EST-IG-notas"></a>\n## Notas completas\n')
 for i in range(1,117):
  r=by[f'EST-IG-nota-{i}'];parents=[a for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i==1:back='[Encabezado del modelo](#EST-IG-encabezado)' if es else '[Cabeçalho do modelo](#EST-IG-encabezado)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append("""
## Observaciones editoriales

Estas observaciones no forman parte del Estatuto ni de sus notas.

- Se conservan los 57 artículos, las 116 notas completas y los once capítulos del modelo de las páginas 511–531. La nota 1 corresponde al encabezado. No se completan el nombre, la sede, el estado ni el domicilio de la Iglesia.
- La nota 1 conserva la decisión histórica que aclara que los modelos no son obligatorios salvo en la materia que forme parte de la CI/IPB. No se presenta el modelo como estatuto aprobado de una iglesia concreta.
- Se restituye la negación del art. 13, § 1º: no se concede carta de transferencia ni se acepta solicitud de exclusión durante el proceso disciplinario. El art. 13, § 2º, conserva el registro separado tras un año de paradero ignorado y la exclusión si no se encuentra al miembro dos años después de ese plazo.
- Se conservan la primera convocatoria de la asamblea ordinaria con cualquier número de asistentes (art. 18), las condiciones de la asamblea extraordinaria y sus siete días (art. 19), y la comprobación del quórum que condiciona el recuento de votos de la asamblea permanente (art. 21). El Presidente actúa como moderador sin voto (art. 22).
- El art. 27 conserva la excepción de urgencia para la presidencia del Vicepresidente, sin admisión, transferencia ni disciplina de miembros. Se preservan los requisitos de quórum y las excepciones de los arts. 32 y 33.
- La nota 85 conserva la regla subsidiaria de reconsideración y su exclusión cuando hubo voto secreto. El original enumera «II-Supremo Concílio», «II – Sínodos» y «III - Presbitérios»; se conserva esa numeración repetida sin atribuirle una corrección oficial. La nota 43 presenta «Art..» en portugués; el español normaliza únicamente su puntuación.
- Se distinguen queja y denuncia (art. 49); se corrigen penas (art. 53), términos contables (art. 45) y las dos votaciones para modificar el estatuto (art. 56). «Tesoureiro» se traduce como «Tesorero», «balancete» como «balance de comprobación» y «caput» como «encabezamiento».
- La nota 2 conserva los números de leyes, fechas, elipsis y procedimientos de registro reproducidos en el texto de 2025. La nota 55 conserva la cita histórica y la Ley nº 14.647 de 2023. Este cotejo no verifica su vigencia actual ni sustituye el examen de un caso concreto.
- El cotejo fue realizado por el asistente contra el texto portugués extraído del PDF de 2025, sin certificación externa. El anexo automático por páginas del Manual completo y el examen exhaustivo de las reformas de 2026 siguen pendientes.
""")
 text=''.join(parts);anchors=re.findall(r'<a id="([^"]+)"',text);assert len(anchors)==len(set(anchors));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='estatuto_iglesia_2025_es_revisado.md' if es else 'estatuto_igreja_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
print('EST-IG: 57 artículos y 116 notas; huellas y enlaces comprobados.')
