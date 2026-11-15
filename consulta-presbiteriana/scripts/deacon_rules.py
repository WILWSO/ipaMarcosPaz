"""Modelo histórico de Estatuto de la Iglesia: texto bilingüe y notas completas."""
import json,re,hashlib,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];d=root/'documentos';c=json.loads((root/'static/corpus.json').read_text());rs=[r for r in c['records'] if r['norm']=='RI-JD'];by={r['id']:r for r in rs};reviews=json.loads((d/'revision_semantica_manual.json').read_text());headings=json.loads((d/'estructura_reglamento_junta_diaconal.json').read_text())
assert set(by)=={f'RI-JD-art-{i}' for i in range(1,35)}|{f'RI-JD-nota-{i}' for i in range(1,2)}
for r in rs:
 a=reviews[r['id']];assert a['sourceHash']==hashlib.sha256(r['textOriginal'].encode()).hexdigest();assert a['translationHash']==hashlib.sha256(r['textEs'].encode()).hexdigest();assert re.findall(r'\[\d+\]',r['textOriginal'])==re.findall(r'\[\d+\]',r['textEs'])
for lang in ['pt','es']:
 es=lang=='es';parts=['# '+('Modelo de Reglamento Interno de la Junta Diaconal' if es else 'Modelo de Regimento Interno da Junta Diaconal')+' — Manual 2025\n\n',('> Traducción española no oficial. Cotejo por el asistente: 34 artículos y una nota completa. Modelo histórico de 2025; no verifica reformas ni vigencia en 2026.\n\n' if es else '> Texto português extraído do Manual 2025: 34 artigos e uma nota completa. Modelo histórico; nome da igreja não preenchido.\n\n'),'## Índice\n\n']
 for n,h in enumerate(headings):
  if h['labelPt'].startswith(('CAPÍTULO',)):parts.append(f'- [{h["labelEs" if es else "labelPt"]} — {h["titleEs" if es else "titlePt"]}](#RI-JD-estrutura-{n})\n')
 parts.append('\n[Notas completas](#RI-JD-notas)\n\n<a id="RI-JD-encabezado"></a>\n## '+('ESTATUTO DEL PRESBITERIO — ______________________________ (insertar nombre y sigla de la Iglesia)' if es else 'REGIMENTO INTERNO DA JUNTA DIACONAL DA IGREJA (nome da igreja)')+'[1](#RI-JD-nota-1)\n\nPDF: 535\n')
 for i in range(1,35):
  for n,h in enumerate(headings):
   if h['article']!=i:continue
   level='####' if h['labelPt'].startswith('Seção') else '##';label=h['labelEs' if es else 'labelPt'];title=h['titleEs' if es else 'titlePt'];parts.append(f'\n<a id="RI-JD-estrutura-{n}"></a>\n{level} {label}'+(' — '+title if title else '')+'\n')
  r=by[f'RI-JD-art-{i}'];t=r['textEs'] if es else r['textOriginal'];t=re.sub(r'\[(\d+)\]',lambda m:f'[{m[1]}](#RI-JD-nota-{m[1]})',t);parts.append(f'\n<a id="{r["id"]}"></a>\n### Art. {i}\n\nID: `{r["id"]}` · PDF: {r["page"]}\n\n{t}\n')
 parts.append('\n<a id="RI-JD-notas"></a>\n## Notas completas\n')
 for i in range(1,2):
  r=by[f'RI-JD-nota-{i}'];parents=[a for a in rs if a['kind']=='articulo' and r['id'] in a['notes']];back=', '.join(f'[Art. {a["article"]}](#{a["id"]})' for a in parents)
  if i==1:back='[Encabezado del modelo](#RI-JD-encabezado)' if es else '[Cabeçalho do modelo](#RI-JD-encabezado)'
  parts.append(f'\n<a id="{r["id"]}"></a>\n### Nota {i}\n\nPDF: {r["page"]} · {back}\n\n'+(r['textEs'] if es else r['textOriginal'])+'\n')
 if es:parts.append("""
## Observaciones editoriales

Estas observaciones no forman parte del Reglamento ni de su nota.

- Se conservan los 34 artículos, los seis capítulos, las secciones y la nota completa del modelo de las páginas 535–546. La nota corresponde al encabezado y conserva la aprobación mediante CE – 2021 – DOC. CCXLIX. No se completa el nombre de la Iglesia.
- Se mantiene la distinción entre el oficio perpetuo y el mandato de cinco años de los diáconos (art. 2), y el mandato de un año de la Mesa Directiva (art. 7). El art. 7, § 1º, conserva la formulación del original que vincula el ejercicio de los cargos con el término del mandato de la Mesa anterior.
- Se restituyen votar y ser elegido (art. 3), las condiciones del recuento de fondos por al menos dos diáconos (arts. 3, 5 y 12), los turnos de servicio, el orden del día y las competencias contables. «Tesoureiro» y «Tesouraria» se traducen como «Tesorero» y «Tesorería»; «vacância», como «vacancia».
- El art. 14 conserva la convocatoria de cinco días, la excepción de urgencia reconocida y la posibilidad de un plazo menor con la conformidad de todos los miembros. El art. 16 conserva la mayoría para el quórum y las decisiones: el empate rechaza la propuesta, salvo en la elección de la Mesa Directiva, en la que el Presidente desempata.
- Se preservan los dos tercios para retirar una propuesta ya en discusión (art. 19) y para pasar a votación (art. 25). La reconsideración en la misma reunión exige consentimiento de la mayoría de quienes participaron y propuesta de alguien que votó con la mayoría; el párrafo único conserva la revisión en otra reunión (art. 27).
- El Consejero conserva voz y carece de voto (art. 30). Las modificaciones exigen dos tercios del Consejo de la Iglesia o determinación de los concilios superiores (art. 33).
- Se restituye la Confesión de Fe dentro de los Símbolos de Fe del art. 34, junto con ambos catecismos. El cotejo conserva el texto de 2025, sin introducir reformas de 2026.
- Cotejo realizado por el asistente contra el texto portugués extraído del PDF de 2025, sin certificación externa. El anexo automático del Manual y el examen exhaustivo del Digesto siguen pendientes.
""")
 text=''.join(parts);anchors=re.findall(r'<a id="([^"]+)"',text);assert len(anchors)==len(set(anchors));assert all(t in anchors for t in re.findall(r'\]\(#([^)]*)\)',text));name='reglamento_junta_diaconal_2025_es_revisado.md' if es else 'regimento_junta_diaconal_2025_pt.md';(d/name).write_text(text);shutil.copyfile(d/name,root/'static/documentos'/name)
print('RI-JD: 34 artículos y una nota; huellas y enlaces comprobados.')
