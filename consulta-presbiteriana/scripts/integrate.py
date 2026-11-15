"""Integra exclusivamente cambios contrastados; conserva el original y todas las notas."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
path=ROOT/'static/corpus.json';data=json.loads(path.read_text());byid={r['id']:r for r in data['records']}
patches=json.loads((ROOT/'documentos/enmiendas_es.json').read_text())
source=byid['SC-2026-CCI']
if not all(f'EC nº {i}' in source['textOriginal'] for i in range(3,9)):raise ValueError('La fuente no contiene las seis EC esperadas.')
for patch in patches:
 rid=f"CI-art-{patch['article']}";base=byid[rid]
 amendment=dict(patch,id=f"EC-{patch['ec']}",target=rid,source=source['id'],pages=source['pages'])
 base['links'].append(amendment['id']);base['status']='modificado-2026'
 # Translation is only of the amendment, never falsely marked as a complete translation of the old article.
 data['amendments'].append(amendment)
 for nid in base['notes']:
  if nid in byid:byid[nid]['status']='nota-historica-articulo-modificado'
source['status']='promulgada';source['reviewedClassification']=True
verified={
 'SC-2026-CCXXXIX':('procedimiento-pendiente','Ordena convocar una Constituyente para la reforma del Código de Disciplina; no promulga un nuevo Código.'),
 'SC-2026-CCVI':('procedimiento-pendiente','Inicia el procedimiento de enmienda del art. 23 §2. No reemplaza todavía su redacción.'),
 'SC-2026-CCIII':('rechazada','Rechaza la propuesta de mandato pastoral por tiempo indeterminado.'),
 'SC-2026-CXXIII':('aprobada','Crea el Consejo de Historia y revoca el art. 8 inciso X del RI-CE y una disposición del RI-SE.'),
 'SC-2026-CLXXXI':('interpretacion-aprobada','Orienta la revisión y aprobación de las actas de reuniones en línea o mixtas en la propia reunión, con registro al final del acta.'),
 'SC-2026-CLIV':('interpretacion-aprobada','Aclara el orden de presidencia de la Asamblea General y las providencias si faltan quienes pueden presidirla.'),
 'SC-2026-CIX':('aprobada','Reformula atribuciones y composición de la Comisión de Sistemas y Métodos; el nuevo reglamento debe presentarse en 2027.'),
 'SC-2026-CLXXXV':('aprobada-con-transicion','Aprueba el reglamento de instituciones de educación teológica con reglas de transición y revoca el anterior RI de la JET.'),
 'CE-2026-CXXXIV':('aprobada','Mantiene la publicación del Manual con notas y autoriza adicionalmente la edición sin notas, con acceso electrónico gratuito.'),
 'CE-2026-CIII':('procedimiento-pendiente','Encarga el anteproyecto de revisión del Reglamento para Confección de Actas para la CE de 2027; no sustituye el reglamento actual.')
}
for id,(status,summary) in verified.items():
 if id in byid:byid[id].update(status=status,summaryEs=summary,reviewedClassification=True)
# Precise links are individually curated. Mentions elsewhere remain unqualified cross-reference candidates.
for target,sourceid in [('RI-CE-art-8','SC-2026-CXXIII'),('ATAS-art-13','SC-2026-CLXXXI'),('CI-art-10','SC-2026-CLIV'),('EST-IG-art-22','SC-2026-CLIV'),('CI-art-23','SC-2026-CCVI')]:
 if target in byid and sourceid in byid:
  byid[target]['links'].append(sourceid);byid[sourceid]['links'].append(target)
data['metadata']['translatedAmendments']=len(patches);data['metadata']['reviewedClassifications']=len(verified)+1
path.write_text(json.dumps(data,ensure_ascii=False),encoding='utf8')
# A transparent integration dossier, not a falsely labelled completed translation.
parts=['# Manual Presbiteriano 2025: integración de reformas de 2026\n\n> Edición de trabajo no oficial. Traducción completa pendiente. Se conservan íntegros los originales portugueses en los archivos separados. Las traducciones siguientes corresponden únicamente a las seis enmiendas contrastadas. Las demás resoluciones requieren examen individual.\n',
 '## Fuentes\n\nManual 2025 con notas y Digesto 2026 proporcionados por el usuario. SC-2026 DOC. CCI, páginas PDF '+', '.join(map(str,source['pages']))+'.\n']
for a in data['amendments']:
 base=byid[a['target']];parts.extend([f"\n## Constitución, art. {a['article']} — EC {a['ec']}\n",f"**Alcance:** {a['scope']}. **Estado:** promulgada. **Fuente:** {a['source']}.\n",'### Redacción de la enmienda, traducida al español\n\n'+a['textEs'], '### Artículo original de 2025, portugués\n\n'+base['textOriginal'],'### Notas de 2025 conservadas — portugués; revisión de compatibilidad pendiente\n'])
 for nid in base['notes']:
  if nid in byid:parts.extend([f"#### {byid[nid]['title']}\n\n"+byid[nid]['textOriginal']])
parts.append('\n## Otras decisiones contrastadas\n')
for id,(status,summary) in verified.items():
 if id in byid:parts.append(f"### {id}\n\nEstado: {status}.\n\n{summary}\n\nPágina PDF: {byid[id]['page']}. Texto completo en digesto_pt_original.md.\n")
(ROOT/'documentos/manual_integrado_es_en_progreso.md').write_text('\n'.join(parts),encoding='utf8')
(ROOT/'documentos/manual_es_en_progreso.md').write_text('# Manual Presbiteriano 2025 — traducción en progreso\n\nLa traducción íntegra de los 560 folios y sus notas NO está terminada. El texto portugués completo está en manual_pt_original.md. Seis enmiendas constitucionales de 2026 están traducidas en manual_integrado_es_en_progreso.md. No debe confundirse este archivo con una edición completa en español.\n',encoding='utf8')
(ROOT/'documentos/digesto_es_en_progreso.md').write_text('# Digesto iCalvinus 2026 — traducción en progreso\n\nLa traducción íntegra de los 355 folios NO está terminada. El texto portugués completo está en digesto_pt_original.md. La clasificación contrastada de once resoluciones y la traducción de seis enmiendas se encuentran en el expediente de integración.\n',encoding='utf8')
for p in (ROOT/'documentos').glob('*.md'):
 (ROOT/'static/documentos'/p.name).write_bytes(p.read_bytes())
print('Integradas',len(data['amendments']),'enmiendas. Traducción completa: PENDIENTE.')
