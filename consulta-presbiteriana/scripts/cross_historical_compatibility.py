"""Reproducible candidate scan and first bounded comparative cross-reference batch."""
import hashlib,json,re,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CITATION=re.compile(r'\b(?:art(?:igo)?s?[.,]?)\s*(\d+\s*[º°]?(?:\s*(?:,|e|a|–|-)\s*\d+\s*[º°]?)*)',re.I)
SEMANTIC=re.compile(r'\b(?:pastor(?:es)?\s+em[ée]rit[oa]s?|termo(?:s)?\s+de\s+(?:abertura|encerramento)|secret[aá]rio.executivo)\b',re.I)
TARGET_NUMBERS={3,8,27,44,54,64,84,88}
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
def scan(c,direct):
 notes=[r for r in c['records'] if r['source']=='manual' and r['kind']=='nota'];assert len(notes)==816
 candidates=[]
 for r in notes:
  if r['id'] in direct:continue
  hits=[]
  for m in CITATION.finditer(r['textOriginal']):
   numbers=list(map(int,re.findall(r'\d+',m.group(1))));selected=set(numbers)&TARGET_NUMBERS
   # Explicit ranges are expanded for candidate discovery only, never for normative interpretation.
   for a,b in re.findall(r'(\d+)\s*[º°]?\s*(?:a|–|-)\s*(\d+)',m.group(1),re.I):
    if 0<int(b)-int(a)<=200:selected|=set(range(int(a),int(b)+1))&TARGET_NUMBERS
   if selected:hits.append({'method':'literal-number-list-or-range','citation':m.group(0),'candidateNumbers':sorted(selected),'contextPt':r['textOriginal'][max(0,m.start()-100):m.end()+220],'start':m.start(),'end':m.end()})
  for m in SEMANTIC.finditer(r['textOriginal']):hits.append({'method':'topic-keyword','citation':m.group(0),'contextPt':r['textOriginal'][max(0,m.start()-100):m.end()+220],'start':m.start(),'end':m.end()})
  if hits:candidates.append({'id':r['id'],'norm':r['norm'],'pages':r['pages'],'originalHash':sha(r['textOriginal']),'hits':hits})
 return notes,candidates

def apply(c):
 d=ROOT/'documentos';data=json.loads((d/'compatibilidad_transversal_lote_01_2026.json').read_text());direct=set(json.loads((d/'compatibilidad_notas_historicas_2026.json').read_text())['directNoteIds']);by={r['id']:r for r in c['records']}
 assert sha(by['SC-2026-CCI']['textOriginal'])==data['reformOriginalHash'];assert sha(by['SC-2026-CCI']['textEs'])==data['reformTranslationHash']
 for source,proof in data['sourcePDFSHA256'].items():assert c['metadata']['sources'][source]['sha256']==proof
 for record in c['records']:
  record.pop('crossHistoricalCompatibilityReview',None);record.pop('crossCompatibilityNoteIds',None)
 notes,candidates=scan(c,direct);candidate_ids={x['id'] for x in candidates};reviewed=set()
 for item in data['items']:
  rid=item['id'];r=by[rid];assert rid in candidate_ids and rid not in direct and rid not in reviewed
  assert sha(r['textOriginal'])==item['originalHash'] and sha(r['textEs'])==item['translationHash'],rid
  assert sorted(item['parents'])==sorted(x['id'] for x in c['records'] if rid in x.get('notes',[])),rid
  r['crossHistoricalCompatibilityReview']={**item,'reviewDate':data['date'],'scope':data['scope'],'externalCertification':False,'officialApproval':False}
  for parent in item['parents']:
   by[parent].setdefault('crossCompatibilityNoteIds',[])
   if rid not in by[parent]['crossCompatibilityNoteIds']:by[parent]['crossCompatibilityNoteIds'].append(rid)
  reviewed.add(rid)
 assert len(reviewed)==20
 pending=[x for x in candidates if x['id'] not in reviewed]
 progress={'reviewDate':data['date'],'notesScanned':len(notes),'directNotesExcluded':len(direct),'crossNotesEligible':len(notes)-len(direct),'candidateNotes':len(candidates),'reviewedCandidateNotes':len(reviewed),'pendingCandidateNotes':len(pending),'pendingIds':[x['id'] for x in pending],'nextId':pending[0]['id'] if pending else None,'scanComplete':True,'candidateReviewComplete':not pending,'globalCompatibilityReviewComplete':False,'officialApproval':False,'externalCertification':False,'documents':['compatibilidad_transversal_lote_01_2026_es.md','compatibilidad_transversal_lote_01_2026_pt.md'],'scope':'Rastreo automático reproducible; números homónimos y coincidencias temáticas requieren clasificación individual. No detecta necesariamente referencias implícitas ni acredita vigencia general.'}
 c['metadata']['crossHistoricalCompatibilityProgress']=progress
 inventory={**progress,'candidateNotesInventory':candidates,'sourcePDFSHA256':data['sourcePDFSHA256']};(d/'inventario_referencias_transversales_2026.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n')
 for lang in ['es','pt']:
  es=lang=='es';parts=['# '+('Compatibilidad transversal — lote 1' if es else 'Compatibilidade transversal — lote 1')+'\n\n',('> Edición de trabajo no oficial. Texto completo de 20 notas cotejado en su relación con las reformas de 2026. No constituye certificación general de vigencia.\n\n' if es else '> Edição de trabalho não oficial. Texto completo de 20 notas conferido em sua relação com as alterações de 2026. Não constitui certificação geral de vigência.\n\n'),'| '+('Control | Resultado' if es else 'Controle | Resultado')+' |\n| --- | --- |\n| '+('Notas rastreadas' if es else 'Notas rastreadas')+' | 816 |\n| '+('Notas directas ya examinadas' if es else 'Notas diretas já examinadas')+' | 25 |\n| '+('Notas elegibles para rastreo transversal' if es else 'Notas elegíveis para rastreio transversal')+f" | 791 |\n| {'Candidatas automáticas' if es else 'Candidatas automáticas'} | {len(candidates)} |\n| {'Candidatas cotejadas en este lote' if es else 'Candidatas conferidas neste lote'} | 20 |\n| {'Candidatas pendientes de clasificación' if es else 'Candidatas pendentes de classificação'} | {len(pending)} |\n\n"]
  parts.append(('El rastreo usa menciones literales de artículos, listas y rangos explícitos, y términos sobre pastor emérito, términos de apertura/cierre y secretario ejecutivo. Una coincidencia con art.44 del Código Civil, art.27 de Liturgia o art.8 del Código de Disciplina no prueba referencia al artículo reformado. Las coincidencias quedan pendientes de clasificación; esta lista no es exhaustiva de relaciones implícitas. Las conclusiones son inferencias editoriales según los PDF suministrados.\n\n' if es else 'O rastreio usa menções literais de artigos, listas e intervalos explícitos, e termos sobre pastor emérito, termos de abertura/encerramento e secretário-executivo. Coincidência com art.44 do Código Civil, art.27 de Liturgia ou art.8 do Código de Disciplina não comprova referência ao artigo alterado. As coincidências permanecem pendentes de classificação; a lista não esgota relações implícitas. As conclusões são inferências editoriais segundo os PDF fornecidos.\n\n'))
  parts.append('SHA-256 PDF Manual 2025: `'+data['sourcePDFSHA256']['manual']+'`\n\nSHA-256 PDF Digesto 2026: `'+data['sourcePDFSHA256']['digesto']+'`\n\n')
  parts.append('| '+('Nota | Artículo reformado | Clasificación editorial' if es else 'Nota | Artigo alterado | Classificação editorial')+' |\n| --- | --- | --- |\n')
  for item in data['items']:parts.append(f"| [{item['id']}](#{item['id']}) | {', '.join(item['targets'])} | {item['classification']} |\n")
  for item in data['items']:
   r=by[item['id']];parts.append(f'\n<a id="{r["id"]}"></a>\n\n## {r["id"]}\n\n'+item['findingEs' if es else 'findingPt']+'\n\nPDF Manual: '+', '.join(map(str,r['pages']))+'\n\n'+('Nota vinculada a: ' if es else 'Nota ligada a: ')+(', '.join(item['parents']) or '—')+'\n\n'+('Reforma: ' if es else 'Alteração: ')+'SC-2026-CCI · '+', '.join(item['targets'])+'\n\n### '+('Texto completo de la nota' if es else 'Texto integral da nota')+'\n\n'+r['textEs' if es else 'textOriginal']+'\n\nSHA-256 original: `'+item['originalHash']+'`\n\nSHA-256 ES: `'+item['translationHash']+'`\n\n')
  parts.append('## '+('Cola de revisión pendiente' if es else 'Fila de revisão pendente')+'\n\n'+('Identificadores de candidatas automáticas, sin declaración de incompatibilidad ni vigencia:\n\n' if es else 'Identificadores de candidatas automáticas, sem declaração de incompatibilidade nem vigência:\n\n')+', '.join(x['id'] for x in pending)+'\n\n')
  parts.append(('Siguiente: clasificar las candidatas restantes, comenzando por las referencias que podrían corresponder a otros cuerpos normativos. Permanecen abiertas las confirmaciones documentales de estatutos, restricciones históricas y bases no suministradas.\n' if es else 'Próximo: classificar as candidatas restantes, começando pelas referências que podem corresponder a outros diplomas normativos. Permanecem abertas as confirmações documentais de estatutos, restrições históricas e bases não fornecidas.\n'))
  name=f'compatibilidad_transversal_lote_01_2026_{lang}.md';(d/name).write_text(''.join(parts));shutil.copyfile(d/name,ROOT/'static/documentos'/name)
 for name in ['compatibilidad_transversal_lote_01_2026.json','inventario_referencias_transversales_2026.json']:shutil.copyfile(d/name,ROOT/'static/documentos'/name)
 return progress
