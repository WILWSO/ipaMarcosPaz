"""Apply individually evidenced effects without replacing pending proposals."""
import hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def digest(text):return hashlib.sha256(text.encode()).hexdigest()
def remove_main_inciso_x(text):
 # The sole revoked clause is in the main body; the paragraph has its own X.
 body,separator,paragraph=text.partition('Parágrafo único.' if 'Parágrafo único.' in text else 'Párrafo único.')
 body,n=re.subn(r'(?m)^X - [^\n]*(?:\n|$)','',body)
 if n!=1:raise ValueError('Expected exactly one main-body inciso X.')
 return body+separator+paragraph
def apply(c):
 d=ROOT/'documentos';by={r['id']:r for r in c['records']};effects=json.loads((d/'efectos_normativos_2026.json').read_text())
 ids=[e['source'] for e in effects]
 if len(ids)!=len(set(ids)):raise ValueError('Duplicate reviewed decisions.')
 for r in c['records']:r.pop('normativeEffects',None)
 # Replace a previously imprecise topic link with the relevant approval provisions.
 for a,b in [('ATAS-art-13','SC-2026-CLXXXI'),('SC-2026-CLXXXI','ATAS-art-13')]:
  by[a]['links']=[x for x in by[a]['links'] if x!=b]
 for e in effects:
  source=by[e['source']]
  assert source['source']=='digesto'
  assert digest(source['textOriginal'])==e['sourceHash']
  assert digest(source['textEs'])==e['translationHash']
  assert e['evidencePt'] in source['textOriginal']
  assert e['sourcePDFSHA256']==c['metadata']['sources']['digesto']['sha256']
  source.setdefault('normativeEffects',[]).append(e['id'])
  for target in e['targets']:
   r=by[target];r.setdefault('normativeEffects',[]).append(e['id'])
   if source['id'] not in r['links']:r['links'].append(source['id'])
   if target not in source['links']:source['links'].append(target)
  if e['kind']=='repeal-clause':
   r=by['RI-CE-art-8'];r['integratedTextPt']=remove_main_inciso_x(r['textOriginal']);r['integratedTextEs']=remove_main_inciso_x(r['textEs']);r['integrationStatus']='revocacion-parcial-CXXIII';r['integrationSources']=[source['id']];r['status']='modificado-2026'
  if e['kind']=='replace-caput':
   r=by[e['targets'][0]]
   assert e['patchTextPt'] in source['textOriginal'] and e['patchTextEs'] in source['textEs']
   for lang,key in [('pt','textOriginal'),('es','textEs')]:
    first,sep,rest=r[key].partition('\n');assert first.startswith('Art. 3º') and rest.startswith('§ 1º')
    r['integratedText'+('Pt' if lang=='pt' else 'Es')]=e['patchText'+('Pt' if lang=='pt' else 'Es')]+sep+rest
   r['integrationStatus']='correccion-caput-CE-CII';r['integrationSources']=[source['id']];r['status']='modificado-2026'
  if e['kind']=='repeal-decision':
   r=by['CE-2026-CXIX'];r['status']='revocada-2026';r['revokedBy']=[source['id']];r['summaryEs']='Antecedente revocado expresamente por SC-2026-CIX, inciso IV; conservar el texto histórico sin presentar el encargo de CE-CXIX como vigente.'
 decisions=[r['id'] for r in c['records'] if r['source']=='digesto'];pending=[rid for rid in decisions if rid not in ids]
 progress={'reviewedDecisions':len(ids),'totalDecisions':len(decisions),'reviewedIds':ids,'pendingDecisions':len(pending),'pendingIds':pending,'nextId':pending[0] if pending else None,'reviewComplete':not pending,'integrationComplete':False,'reviewDate':'2026-10-14','externalCertification':False,'scope':'Efectos según los PDF suministrados; no acredita hechos posteriores ni aprobación oficial.','textPatches':{'constitutionalAmendments':len(c['amendments']),'additionalClauseRepeals':sum(e['kind']=='repeal-clause' for e in effects),'additionalCaputReplacements':sum(e['kind']=='replace-caput' for e in effects)},'revokedDecisions':['CE-2026-CXIX']}
 c['normativeEffects']=effects;c['metadata']['normativeIntegrationProgress']=progress
 matrix=[{'source':rid,'pages':by[rid]['pages'],'status':'cotejado-efectos' if rid in ids else 'pendiente-examen-efectos','effectId':next((e['id'] for e in effects if e['source']==rid),None)} for rid in decisions]
 (d/'matriz_integracion_2026.json').write_text(json.dumps({'progress':progress,'decisions':matrix},ensure_ascii=False,indent=2)+'\n')
 all_effects=effects;effects=effects[:10]
 for lang in ['es','pt']:
  es=lang=='es';note='noteEs' if es else 'notePt';limits='limitsEs' if es else 'limitsPt'
  text=('# Integración normativa 2026 — primer lote prioritario\n\n> Edición de trabajo no oficial. Diez decisiones cotejadas por sus efectos; 10/398 examinadas, 388 pendientes de examen normativo. La traducción y el cotejo textual del Digesto están completos: 398/398. Este examen es una fase distinta. Se mantienen las seis enmiendas constitucionales y se incorpora la revocación del inciso X del cuerpo principal del RI-CE art. 8. CE-2026-CXIX queda identificada como antecedente revocado. Integración exhaustiva y revisión editorial final pendientes; sin certificación externa.\n\n' if es else '# Integração normativa 2026 — primeiro lote prioritário\n\n> Edição de trabalho não oficial. Dez decisões conferidas quanto aos efeitos; 10/398 examinadas, 388 pendentes de exame normativo. Tradução e cotejo textual do Digesto completos: 398/398. Este exame é fase distinta. Mantêm-se as seis emendas constitucionais e incorpora-se a revogação do inciso X do corpo principal do RI-CE art. 8. CE-2026-CXIX fica identificada como antecedente revogado. Integração exaustiva e revisão editorial final pendentes; sem certificação externa.\n\n')
  text+=('| Decisión | Efecto | Artículos o decisiones relacionados |\n| --- | --- | --- |\n' if es else '| Decisão | Efeito | Artigos ou decisões relacionados |\n| --- | --- | --- |\n')
  for e in effects:text+=f"| {e['source']} | {e[note]} | {', '.join(e['targets']) or ('Política de publicación' if es else 'Política de publicação')} |\n"
  text+='\n'+('## Alcance y fuentes\n\nLas remisiones temáticas no significan modificación de todo el artículo. Las propuestas y encargos se presentan como tales. No se fija una fecha exacta de entrada en vigor cuando el texto no la indica. Los reglamentos y actos futuros o exteriores al corpus se identifican sin reconstruirlos.\n\n' if es else '## Alcance e fontes\n\nRemissões temáticas não significam alteração de todo o artigo. Propostas e determinações são apresentadas como tais. Não se fixa data exata de início de vigência quando o texto não a indica. Regimentos e atos futuros ou externos ao corpus são identificados sem reconstrução.\n\n')
  for e in effects:
   source=by[e['source']];text+=f"## {e['source']}\n\nPDF: {', '.join(map(str,e['pages']))}.\n\n{e[note]}\n\n{e[limits]}\n\n"
   text+=('Evidencia del acuerdo — portugués:\n\n' if es else 'Evidência da deliberação — português:\n\n')+e['evidencePt']+'\n\n'
   text+=('### Decisión completa — español cotejado\n\n' if es else '### Decisão completa — português original\n\n')+source['textEs' if es else 'textOriginal']+'\n\n'
   if e['kind']=='repeal-clause':
    r=by['RI-CE-art-8'];text+=('### RI-CE art. 8 — texto histórico 2025\n\n' if es else '### RI-CE art. 8 — texto histórico 2025\n\n')+r['textEs' if es else 'textOriginal']+'\n\n'
    text+=('### RI-CE art. 8 — redacción integrada parcial\n\n' if es else '### RI-CE art. 8 — redação integrada parcial\n\n')+r['integratedTextEs' if es else 'integratedTextPt']+'\n\n'
  text+=('Siguiente examen: restantes decisiones, desde SC-2026-CCXLI en orden del corpus, sin repetir las diez ya examinadas. Prioridad adicional: corrección puntual del art. 3 de Actas y reglamentos con transición.\n' if es else 'Próximo exame: decisões restantes, desde SC-2026-CCXLI na ordem do corpus, sem repetir as dez já examinadas. Prioridade adicional: correção pontual do art. 3 de Atas e regimentos com transição.\n')
  path=d/f'integracion_normativa_lote_01_2026_{lang}.md'
  if not path.exists():path.write_text(text)
 from normative_batch_documents import render
 render(c,all_effects)
 return progress
