"""Third bounded cross-reference batch: presbytery competence and representation."""
import hashlib,json,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
def apply(c):
 d=ROOT/'documentos';data=json.loads((d/'compatibilidad_transversal_lote_03_2026.json').read_text());inv=json.loads((d/'inventario_referencias_transversales_2026.json').read_text());by={r['id']:r for r in c['records']};candidate_ids={x['id'] for x in inv['candidateNotesInventory']};reviewed={r['id'] for r in c['records'] if r.get('crossHistoricalCompatibilityReview')};excluded={r['id'] for r in c['records'] if r.get('crossReferenceClassification')};selected=set()
 for rid,proof in data['reformProvenance'].items():
  assert sha(by[rid]['textOriginal'])==proof['originalHash'] and sha(by[rid]['textEs'])==proof['translationHash'],rid
 for source,h in data['sourcePDFSHA256'].items():assert c['metadata']['sources'][source]['sha256']==h
 for item in data['items']:
  rid=item['id'];r=by[rid];assert rid in candidate_ids and rid not in reviewed|excluded|selected,rid
  assert sha(r['textOriginal'])==item['originalHash'] and sha(r['textEs'])==item['translationHash'],rid
  assert sorted(item['parents'])==sorted(x['id'] for x in c['records'] if rid in x.get('notes',[])),rid
  for target in item['targets']:assert target in by,target
  r['crossHistoricalCompatibilityReview']={**item,'reviewDate':data['date'],'officialApproval':False,'externalCertification':False}
  for parent in item['parents']:
   by[parent].setdefault('crossCompatibilityNoteIds',[])
   if rid not in by[parent]['crossCompatibilityNoteIds']:by[parent]['crossCompatibilityNoteIds'].append(rid)
  selected.add(rid)
 assert len(selected)==30 and len(reviewed)==20 and len(excluded)==40
 reviewed|=selected;pending=[x for x in inv['candidateNotesInventory'] if x['id'] not in reviewed|excluded]
 progress={**c['metadata']['crossHistoricalCompatibilityProgress'],'reviewedCandidateNotes':len(reviewed|excluded),'comparedReformRelatedNotes':len(reviewed),'excludedOtherReferenceNotes':len(excluded),'pendingCandidateNotes':len(pending),'pendingIds':[x['id'] for x in pending],'nextId':pending[0]['id'] if pending else None,'candidateReviewComplete':not pending,'globalCompatibilityReviewComplete':False,'documents':c['metadata']['crossHistoricalCompatibilityProgress']['documents']+['compatibilidad_transversal_lote_03_2026_es.md','compatibilidad_transversal_lote_03_2026_pt.md']}
 c['metadata']['crossHistoricalCompatibilityProgress']=progress
 for item in inv['candidateNotesInventory']:item['classificationStatus']='reviewed-reform-relation' if item['id'] in reviewed else 'resolved-other-body' if item['id'] in excluded else 'pending'
 inv.update(progress);(d/'inventario_referencias_transversales_2026.json').write_text(json.dumps(inv,ensure_ascii=False,indent=2)+'\n')
 for lang in ['es','pt']:
  es=lang=='es';parts=['# '+('Compatibilidad transversal — lote 3: Presbiterio y representación' if es else 'Compatibilidade transversal — lote 3: Presbitério e representação')+'\n\n',('> Edición de trabajo no oficial. Texto completo de 30 notas cotejado en su relación con reformas y aclaraciones de 2026. No certifica vigencia general ni legislación fiscal actual. Se conservan íntegros los textos históricos y las redacciones integradas.\n\n' if es else '> Edição de trabalho não oficial. Texto integral de 30 notas conferido na relação com alterações e esclarecimentos de 2026. Não certifica vigência geral nem legislação tributária atual. Conservados integralmente textos históricos e redações integradas.\n\n'),'| '+('Control | Resultado' if es else 'Controle | Resultado')+' |\n| --- | --- |\n| '+('Notas de este lote' if es else 'Notas deste lote')+' | 30 |\n| '+('Notas transversales con relación a reformas examinada' if es else 'Notas transversais com relação às alterações examinada')+' | 50 |\n| '+('Referencias a otros dispositivos clasificadas' if es else 'Referências a outros dispositivos classificadas')+' | 40 |\n| '+('Candidatas clasificadas acumuladas' if es else 'Candidatas classificadas acumuladas')+' | 90/142 |\n| '+('Candidatas pendientes' if es else 'Candidatas pendentes')+' | 52 |\n\n']
  parts.append(('Las conclusiones son inferencias editoriales limitadas a las fuentes identificadas. Sin conflicto directo con una enmienda no equivale a vigente sin reservas. Las decisiones sobre sustento y plantación se leen con sus condiciones expresas, sin convertir un considerando o propuesta en dispositivo aprobado. Las opiniones fiscales históricas se atribuyen a sus resoluciones.\n\n' if es else 'As conclusões são inferências editoriais limitadas às fontes identificadas. Sem conflito direto com uma emenda não significa vigente sem ressalvas. Decisões sobre sustento e plantação são lidas com condições expressas, sem transformar considerando ou proposta em dispositivo aprovado. Opiniões tributárias históricas são atribuídas às respectivas resoluções.\n\n'))
  parts.append('SHA-256 PDF Manual 2025: `'+data['sourcePDFSHA256']['manual']+'`\n\nSHA-256 PDF Digesto 2026: `'+data['sourcePDFSHA256']['digesto']+'`\n\n')
  parts.append('| '+('Nota | Dispositivo relacionado | Clasificación' if es else 'Nota | Dispositivo relacionado | Classificação')+' |\n| --- | --- | --- |\n')
  for item in data['items']:parts.append(f"| [{item['id']}](#{item['id']}) | {', '.join(item['targets'])} | {item['classification']} |\n")
  for item in data['items']:
   r=by[item['id']];parts.append(f'\n<a id="{item["id"]}"></a>\n\n## {item["id"]}\n\n'+item['findingEs' if es else 'findingPt']+'\n\nPDF Manual: '+', '.join(map(str,r['pages']))+'\n\n'+('Fuentes de 2026: ' if es else 'Fontes de 2026: ')+', '.join(item['sources'])+'\n\n'+('Nota vinculada a: ' if es else 'Nota ligada a: ')+', '.join(item['parents'])+'\n\n### '+('Nota completa' if es else 'Nota integral')+'\n\n'+r['textEs' if es else 'textOriginal']+'\n\nSHA-256 original: `'+item['originalHash']+'`\n\nSHA-256 ES: `'+item['translationHash']+'`\n\n')
  parts.append('## '+('Fuentes de las reformas y aclaraciones' if es else 'Fontes das alterações e esclarecimentos')+'\n\n')
  for rid,proof in sorted(data['reformProvenance'].items()):
   r=by[rid];parts.append(f'\n<a id="{rid}"></a>\n\n### {rid}\n\nPDF Digesto: '+', '.join(map(str,r['pages']))+'\n\n'+r['textEs' if es else 'textOriginal']+'\n\nSHA-256 original: `'+proof['originalHash']+'`\n\nSHA-256 ES: `'+proof['translationHash']+'`\n\n')
  parts.append('## '+('Pendientes' if es else 'Pendências')+'\n\n'+('52 candidatas del rastreo pendientes de clasificación, además de relaciones implícitas y confirmaciones documentales. Debe confirmarse la compatibilidad del voto específico de ministro jubilado (CI49 §5) con el caput CI27 reformado, cuando no sea representante; no se da por resuelta por conservar ambos textos.\n\n' if es else '52 candidatas do rastreio pendentes de classificação, além de relações implícitas e confirmações documentais. Confirmar a compatibilidade do voto específico do ministro jubilado (CI49 §5) com o caput CI27 alterado, quando não for representante; conservar os dois textos não resolve essa leitura.\n\n')+', '.join(x['id'] for x in pending)+'\n\n'+('Siguiente: Secretaría Ejecutiva, disponibilidad, credenciales y las coincidencias restantes de Liturgia y Disciplina.\n' if es else 'Próximo: Secretaria Executiva, disponibilidade, credenciais e demais coincidências de Liturgia e Disciplina.\n'))
  name=f'compatibilidad_transversal_lote_03_2026_{lang}.md';(d/name).write_text(''.join(parts));shutil.copyfile(d/name,ROOT/'static/documentos'/name)
 for name in ['compatibilidad_transversal_lote_03_2026.json','inventario_referencias_transversales_2026.json']:shutil.copyfile(d/name,ROOT/'static/documentos'/name)
 return progress
