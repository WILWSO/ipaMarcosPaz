"""Publish selected unresolved confirmations separately from normative text."""
import hashlib,json,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def apply(c):
 d=ROOT/'documentos';by={r['id']:r for r in c['records']};data=json.loads((d/'pendientes_confirmacion_documental_2026.json').read_text())
 assert len(data['items'])==7 and len({x['id'] for x in data['items']})==7 and not data['exhaustive']
 for item in data['items']:
  assert item['status'] in ['open','partially-resolved','resolved-editorially','resolved-documentarily']
  for proof in item['sources']:
   r=by[proof['id']]
   assert hashlib.sha256(r['textOriginal'].encode()).hexdigest()==proof['originalHash'],proof['id']
   assert hashlib.sha256(r['textEs'].encode()).hexdigest()==proof['translationHash'],proof['id']
   assert r['pages']==proof['pages']
 resolved=sum(item['status'].startswith('resolved-') for item in data['items']);active=len(data['items'])-resolved
 progress={'date':data['date'],'selectedIssueGroups':7,'reviewedSelectedGroups':7,'resolvedSelectedGroups':resolved,'openSelectedGroups':active,'partiallyResolvedGroups':sum(item['status']=='partially-resolved' for item in data['items']),'exhaustive':False,'confirmationComplete':False,'officialApproval':False,'externalCertification':False,'documents':['pendientes_confirmacion_documental_2026_es.md','pendientes_confirmacion_documental_2026_pt.md']}
 c['metadata']['documentaryConfirmationProgress']=progress
 c['documentaryConfirmations']=data['items']
 for lang in ['es','pt']:
  es=lang=='es';parts=['# '+('Pendientes de confirmación documental' if es else 'Pendências de confirmação documental')+' — 2026\n\n',('Clasificación del rastreo concluida: **142/142 candidatas; 0 pendientes de clasificación**. Los siete grupos seleccionados fueron revisados: **dos cerrados en el alcance indicado y cinco con cuestiones pendientes**. Tres de estos cinco tienen avances parciales. No es un inventario exhaustivo de cuestiones por confirmar. No equivalen a siete reformas adicionales. La traducción y el examen de efectos del Digesto están completos: 398/398.\n\nSe conservan separados del texto normativo, con fuentes, páginas y hashes. Las observaciones son inferencias editoriales de trabajo; no sustituyen una decisión competente. Compatibilidad global definitiva, revisión editorial final, aprobación oficial y certificación externa pendientes.\n\n' if es else 'Classificação do rastreio concluída: **142/142 candidatas; 0 pendentes de classificação**. Os sete grupos selecionados foram examinados: **dois encerrados no alcance indicado e cinco com questões pendentes**. Três destes cinco têm avanços parciais. Não é inventário exaustivo de questões a confirmar. Não equivalem a sete reformas adicionais. Tradução e exame dos efeitos do Digesto completos: 398/398.\n\nConservados separados do texto normativo, com fontes, páginas e hashes. As observações são inferências editoriais de trabalho; não substituem decisão competente. Compatibilidade global definitiva, revisão editorial final, aprovação oficial e certificação externa pendentes.\n\n')]
  status_labels={'open':('Abierto','Aberto'),'partially-resolved':('Parcialmente resuelto','Parcialmente resolvido'),'resolved-editorially':('Cerrado por cotejo editorial, en el alcance indicado','Encerrado por conferência editorial, no alcance indicado'),'resolved-documentarily':('Cerrado por comprobación documental, en el alcance indicado','Encerrado por verificação documental, no alcance indicado')}
  for item in data['items']:
   parts.append('## '+item['id']+' — '+item['titleEs' if es else 'titlePt']+'\n\n**'+('Estado: ' if es else 'Situação: ')+status_labels[item['status']][0 if es else 1]+'.'+'**\n\n'+item['findingEs' if es else 'findingPt']+'\n\n')
   parts.append('### '+('Pieza necesaria o límite del cierre' if es else 'Peça necessária ou limite do encerramento')+'\n\n'+item['neededEs' if es else 'neededPt']+'\n\n')
   for external in item.get('externalSources',[]):parts.append('['+external['title']+']('+external['url']+') — '+external['approval']+'; PDF '+', '.join(map(str,external['verifiedPages']))+'.\n\n')
   for proof in item['sources']:
    r=by[proof['id']];parts.append('- **'+proof['id']+'** — PDF '+r['source']+': '+', '.join(map(str,proof['pages']))+'; SHA-256 PT `'+proof['originalHash']+'`; ES `'+proof['translationHash']+'`.\n')
   parts.append('\n')
  parts.append(('Las fuentes completas se conservan en el Manual, el Digesto y los informes de compatibilidad; este registro no modifica sus textos. Para el último cotejo, véase [lote 5](compatibilidad_transversal_lote_05_2026_es.md).\n' if es else 'As fontes integrais estão conservadas no Manual, no Digesto e nos relatórios de compatibilidade; este registro não altera seus textos. Para o último cotejo, consulte [lote 5](compatibilidad_transversal_lote_05_2026_pt.md).\n'))
  name=f'pendientes_confirmacion_documental_2026_{lang}.md';(d/name).write_text(''.join(parts));shutil.copyfile(d/name,ROOT/'static/documentos'/name)
 shutil.copyfile(d/'pendientes_confirmacion_documental_2026.json',ROOT/'static/documentos/pendientes_confirmacion_documental_2026.json')
 return progress
