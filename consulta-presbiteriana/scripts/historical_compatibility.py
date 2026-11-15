"""Attach bounded documentary compatibility findings; never alter source text."""
import hashlib,json,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
def apply(c):
 d=ROOT/'documentos';data=json.loads((d/'compatibilidad_notas_historicas_2026.json').read_text());by={r['id']:r for r in c['records']}
 for source,proof in data['reformProvenance'].items():
  assert sha(by[source]['textOriginal'])==proof['originalHash'],source
  assert sha(by[source]['textEs'])==proof['translationHash'],source
  assert c['metadata']['sources']['digesto']['sha256']==proof['pdfSHA256'],source
 for item in data['items']:
  r=by[item['id']]
  assert sha(r['textOriginal'])==item['originalHash'],item['id']
  assert sha(r['textEs'])==item['translationHash'],item['id']
  if item['kind']=='article':
   assert r['notes']==item['noteIds'],item['id']
   for lang in ['Pt','Es']:assert sha(r['integratedText'+lang])==item['integratedHash'+lang],item['id']
  for source in item['sources']:assert source in by,source
  r['historicalCompatibilityReview']={**item,'reviewDate':data['date'],'scope':data['scope'],'externalCertification':False,'officialApproval':False}
 ids=[n for rid in data['changedArticles'] for n in by[rid]['notes']]
 assert set(ids)==set(data['directNoteIds']) and len(ids)==25
 progress={'reviewDate':data['date'],'comparedChangedArticles':8,'totalChangedArticles':8,'comparedDirectNotes':25,'totalDirectNotes':25,'comparedRelatedProvisions':2,'directScopeComplete':True,'globalCompatibilityReviewComplete':False,'officialApproval':False,'externalCertification':False,'documents':['compatibilidad_notas_historicas_2026_es.md','compatibilidad_notas_historicas_2026_pt.md'],'pendingEs':data['pendingEs'],'pendingPt':data['pendingPt']}
 c['metadata']['historicalCompatibilityProgress']=progress
 for lang in ['es','pt']:
  es=lang=='es';parts=['# '+('Compatibilidad de notas históricas con reformas de 2026' if es else 'Compatibilidade das notas históricas com alterações de 2026')+'\n\n',('> Revisión documental de trabajo, 14 de octubre de 2026. Ocho artículos modificados, sus 25 notas directas y dos disposiciones relacionadas examinados. No certifica vigencia general, aprobación oficial ni revisión transversal de todas las notas.\n\n' if es else '> Revisão documental de trabalho, 14 de outubro de 2026. Oito artigos alterados, suas 25 notas diretas e duas disposições relacionadas examinados. Não certifica vigência geral, aprovação oficial nem revisão transversal de todas as notas.\n\n'),('Las conclusiones son inferencias editoriales limitadas al cotejo de los PDF suministrados. Los textos originales, las traducciones y las ocho redacciones integradas se conservan íntegros. Un pasaje incompatible no implica revocación completa de todas las resoluciones de una nota. Sin conflicto directo en este alcance no equivale a vigente sin reservas.\n\n' if es else 'As conclusões são inferências editoriais limitadas ao cotejo dos PDF fornecidos. Textos originais, traduções e as oito redações integradas são conservados integralmente. Uma passagem incompatível não implica revogação integral de todas as resoluções de uma nota. Sem conflito direto nesse alcance não significa vigente sem ressalvas.\n\n'),'| '+('Artículo | Notas directas | Fuente de la reforma' if es else 'Artigo | Notas diretas | Fonte da alteração')+' |\n| --- | --- | --- |\n']
  parts.append('SHA-256 PDF Manual 2025: `'+data['sourcePDFSHA256']['manual']+'`\n\nSHA-256 PDF Digesto 2026: `'+data['sourcePDFSHA256']['digesto']+'`\n\n')
  for rid in data['changedArticles']:
   item=next(i for i in data['items'] if i['id']==rid);parts.append(f"| [{rid}](#{rid}) | {', '.join(item['noteIds']) or '0'} | {', '.join(item['sources'])} |\n")
  for rid in data['changedArticles']:
   r=by[rid];item=r['historicalCompatibilityReview'];parts.append(f'\n<a id="{rid}"></a>\n\n## {rid}\n\n'+item['findingEs' if es else 'findingPt']+'\n\nPDF: '+', '.join(map(str,r['pages']))+'\n\n')
   for source in item['sources']:parts.append(('Reforma: ' if es else 'Alteração: ')+source+' · PDF: '+', '.join(map(str,by[source]['pages']))+'\n\n')
   parts.append('### '+('Texto histórico 2025' if es else 'Texto histórico 2025')+'\n\n'+r['textEs' if es else 'textOriginal']+'\n\n### '+('Texto integrado parcial' if es else 'Texto integrado parcial')+'\n\n'+r['integratedTextEs' if es else 'integratedTextPt']+'\n\n')
   parts.append('SHA-256 original: `'+item['originalHash']+'`\n\nSHA-256 integrado: `'+item['integratedHashEs' if es else 'integratedHashPt']+'`\n\n')
   for n in [i for i in data['items'] if i.get('article')==rid]:
    nr=by[n['id']];parts.append(f'\n<a id="{n["id"]}"></a>\n\n### {n["id"]}\n\n'+('Clasificación editorial: ' if es else 'Classificação editorial: ')+n['classification']+'\n\n'+n['findingEs' if es else 'findingPt']+'\n\nPDF: '+', '.join(map(str,nr['pages']))+'\n\n'+nr['textEs' if es else 'textOriginal']+'\n\nSHA-256 original: `'+n['originalHash']+'`\n\nSHA-256 ES: `'+n['translationHash']+'`\n\n')
  parts.append('## '+('Trabajo pendiente' if es else 'Trabalho pendente')+'\n\n')
  for note in data['pendingEs' if es else 'pendingPt']:parts.append('- '+note+'\n')
  name=f'compatibilidad_notas_historicas_2026_{lang}.md';(d/name).write_text(''.join(parts));shutil.copyfile(d/name,ROOT/'static/documentos'/name)
 shutil.copyfile(d/'compatibilidad_notas_historicas_2026.json',ROOT/'static/documentos/compatibilidad_notas_historicas_2026.json')
 return progress
